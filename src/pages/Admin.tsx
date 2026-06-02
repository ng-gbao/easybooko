import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Hotel, BedDouble, BookOpen, Users, Shield, ShieldOff } from "lucide-react";
import { format } from "date-fns";

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
  pending: "Đang chờ",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();

  if (authLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/" />;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Trang Admin</h1>
      <Tabs defaultValue="hotels">
        <TabsList className="mb-6">
          <TabsTrigger value="hotels"><Hotel className="h-4 w-4 mr-1" /> Khách sạn</TabsTrigger>
          <TabsTrigger value="rooms"><BedDouble className="h-4 w-4 mr-1" /> Phòng</TabsTrigger>
          <TabsTrigger value="bookings"><BookOpen className="h-4 w-4 mr-1" /> Đặt phòng</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" /> Người dùng</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels"><HotelsTab /></TabsContent>
        <TabsContent value="rooms"><RoomsTab /></TabsContent>
        <TabsContent value="bookings"><BookingsTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
      </Tabs>
    </div>
  );
};

function HotelsTab() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", location: "", description: "", price_per_night: "", rating: "", property_type: "hotel", amenities: "", images: "" });

  const { data: hotels } = useQuery({
    queryKey: ["admin-hotels"],
    queryFn: async () => {
      const { data } = await supabase.from("hotels").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        location: form.location,
        description: form.description,
        price_per_night: parseFloat(form.price_per_night),
        rating: parseFloat(form.rating) || 0,
        property_type: form.property_type,
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (editing) {
        const { error } = await supabase.from("hotels").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hotels").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      setOpen(false);
      setEditing(null);
      resetForm();
      toast.success(editing ? "Đã cập nhật khách sạn" : "Đã thêm khách sạn");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hotels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      toast.success("Đã xoá khách sạn");
    },
  });

  const resetForm = () => setForm({ name: "", location: "", description: "", price_per_night: "", rating: "", property_type: "hotel", amenities: "", images: "" });

  const openEdit = (h: any) => {
    setEditing(h);
    setForm({
      name: h.name,
      location: h.location,
      description: h.description || "",
      price_per_night: String(h.price_per_night),
      rating: String(h.rating || ""),
      property_type: h.property_type || "hotel",
      amenities: (h.amenities || []).join(", "),
      images: (h.images || []).join(", "),
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold">Khách sạn ({hotels?.length || 0})</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Thêm khách sạn</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Sửa khách sạn" : "Thêm khách sạn"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Tên khách sạn" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Địa điểm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Textarea placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Giá/đêm" type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: e.target.value })} />
                <Input placeholder="Đánh giá (0-5)" type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </div>
              <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                <SelectTrigger><SelectValue placeholder="Loại hình lưu trú" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Khách sạn</SelectItem>
                  <SelectItem value="apartment">Căn hộ</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Tiện nghi (cách nhau bởi dấu phẩy)" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
              <Input placeholder="URL hình ảnh (cách nhau bởi dấu phẩy)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
              <Button className="w-full" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Đang lưu..." : editing ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {hotels?.map((h) => (
          <Card key={h.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{h.name}</h3>
                <p className="text-sm text-muted-foreground">{h.location} • ${h.price_per_night}/đêm • ⭐ {h.rating}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => openEdit(h)} aria-label="Sửa"><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(h.id)} aria-label="Xoá"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RoomsTab() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ hotel_id: "", type: "single", price: "" });

  const { data: hotels } = useQuery({
    queryKey: ["admin-hotels"],
    queryFn: async () => {
      const { data } = await supabase.from("hotels").select("id, name").order("name");
      return data || [];
    },
  });

  const { data: rooms } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: async () => {
      const { data } = await supabase.from("rooms").select("*, hotels(name)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addRoom = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rooms").insert({
        hotel_id: form.hotel_id,
        type: form.type,
        price: parseFloat(form.price),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      setOpen(false);
      setForm({ hotel_id: "", type: "single", price: "" });
      toast.success("Đã thêm phòng");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      toast.success("Đã xoá phòng");
    },
  });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold">Phòng ({rooms?.length || 0})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Thêm phòng</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Thêm phòng</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Select value={form.hotel_id} onValueChange={(v) => setForm({ ...form, hotel_id: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn khách sạn" /></SelectTrigger>
                <SelectContent>
                  {hotels?.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Phòng đơn</SelectItem>
                  <SelectItem value="double">Phòng đôi</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Giá/đêm" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Button className="w-full" onClick={() => addRoom.mutate()} disabled={addRoom.isPending}>Thêm phòng</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Khách sạn</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms?.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{(r.hotels as any)?.name}</TableCell>
              <TableCell className="capitalize">{r.type}</TableCell>
              <TableCell>${r.price}</TableCell>
              <TableCell>
                <Button variant="outline" size="icon" className="text-destructive" onClick={() => deleteRoom.mutate(r.id)} aria-label="Xoá">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BookingsTab() {
  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, hotels(name), rooms(type), profiles:user_id(full_name)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold mb-4">Tất cả đặt phòng ({bookings?.length || 0})</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Khách</TableHead>
            <TableHead>Khách sạn</TableHead>
            <TableHead>Phòng</TableHead>
            <TableHead>Ngày</TableHead>
            <TableHead>Tổng</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{(b.profiles as any)?.full_name || "Ẩn danh"}</TableCell>
              <TableCell>{(b.hotels as any)?.name}</TableCell>
              <TableCell className="capitalize">{(b.rooms as any)?.type}</TableCell>
              <TableCell>{format(new Date(b.check_in), "dd/MM")} – {format(new Date(b.check_out), "dd/MM")}</TableCell>
              <TableCell>${b.total_price}</TableCell>
              <TableCell><Badge variant={b.status === "confirmed" ? "default" : "secondary"}>{STATUS_LABEL[b.status] || b.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function UsersTab() {
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const adminIds = new Set((roles || []).filter((r) => r.role === "admin").map((r) => r.user_id));
      return (profiles || []).map((p) => ({ ...p, isAdmin: adminIds.has(p.id) }));
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Đã cập nhật quyền người dùng");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold mb-4">Người dùng ({users?.length || 0})</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Cấp quyền Admin cho người dùng đáng tin để họ có thể quản lý khách sạn, phòng và đặt phòng.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Tham gia</TableHead>
            <TableHead>Quyền</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.full_name || "Chưa đặt tên"}</TableCell>
              <TableCell>{format(new Date(u.created_at), "dd/MM/yyyy")}</TableCell>
              <TableCell>
                <Badge variant={u.isAdmin ? "default" : "secondary"}>{u.isAdmin ? "Admin" : "Người dùng"}</Badge>
              </TableCell>
              <TableCell>
                {u.isAdmin ? (
                  <Button variant="outline" size="sm" onClick={() => toggleAdmin.mutate({ userId: u.id, makeAdmin: false })}>
                    <ShieldOff className="h-4 w-4 mr-1" /> Thu hồi Admin
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => toggleAdmin.mutate({ userId: u.id, makeAdmin: true })}>
                    <Shield className="h-4 w-4 mr-1" /> Cấp quyền Admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Admin;
