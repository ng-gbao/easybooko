import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Hotel, BedDouble, BookOpen, Users, Shield, ShieldOff } from "lucide-react";
import { format } from "date-fns";

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();

  if (authLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/" />;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Admin Panel</h1>
      <Tabs defaultValue="hotels">
        <TabsList className="mb-6">
          <TabsTrigger value="hotels"><Hotel className="h-4 w-4 mr-1" /> Hotels</TabsTrigger>
          <TabsTrigger value="rooms"><BedDouble className="h-4 w-4 mr-1" /> Rooms</TabsTrigger>
          <TabsTrigger value="bookings"><BookOpen className="h-4 w-4 mr-1" /> Bookings</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" /> Users</TabsTrigger>
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
      toast.success(editing ? "Hotel updated" : "Hotel added");
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
      toast.success("Hotel deleted");
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
        <h2 className="font-heading text-xl font-semibold">Hotels ({hotels?.length || 0})</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Hotel</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Price/night" type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: e.target.value })} />
                <Input placeholder="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </div>
              <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                <SelectTrigger><SelectValue placeholder="Property type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Amenities (comma-separated)" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
              <Input placeholder="Image URLs (comma-separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
              <Button className="w-full" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"}
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
                <p className="text-sm text-muted-foreground">{h.location} • ${h.price_per_night}/night • ⭐ {h.rating}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => openEdit(h)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(h.id)}><Trash2 className="h-4 w-4" /></Button>
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
      toast.success("Room added");
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
      toast.success("Room deleted");
    },
  });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold">Rooms ({rooms?.length || 0})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Room</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Select value={form.hotel_id} onValueChange={(v) => setForm({ ...form, hotel_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select hotel" /></SelectTrigger>
                <SelectContent>
                  {hotels?.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Price/night" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Button className="w-full" onClick={() => addRoom.mutate()} disabled={addRoom.isPending}>Add Room</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hotel</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
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
                <Button variant="outline" size="icon" className="text-destructive" onClick={() => deleteRoom.mutate(r.id)}>
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
      <h2 className="font-heading text-xl font-semibold mb-4">All Bookings ({bookings?.length || 0})</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{(b.profiles as any)?.full_name || "Unknown"}</TableCell>
              <TableCell>{(b.hotels as any)?.name}</TableCell>
              <TableCell className="capitalize">{(b.rooms as any)?.type}</TableCell>
              <TableCell>{format(new Date(b.check_in), "MMM dd")} – {format(new Date(b.check_out), "MMM dd")}</TableCell>
              <TableCell>${b.total_price}</TableCell>
              <TableCell><Badge variant={b.status === "confirmed" ? "default" : "secondary"}>{b.status}</Badge></TableCell>
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
      toast.success("User role updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold mb-4">Users ({users?.length || 0})</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Promote trusted users to admin so they can manage hotels, rooms, and bookings.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.full_name || "Unnamed"}</TableCell>
              <TableCell>{format(new Date(u.created_at), "MMM dd, yyyy")}</TableCell>
              <TableCell>
                <Badge variant={u.isAdmin ? "default" : "secondary"}>{u.isAdmin ? "admin" : "user"}</Badge>
              </TableCell>
              <TableCell>
                {u.isAdmin ? (
                  <Button variant="outline" size="sm" onClick={() => toggleAdmin.mutate({ userId: u.id, makeAdmin: false })}>
                    <ShieldOff className="h-4 w-4 mr-1" /> Revoke admin
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => toggleAdmin.mutate({ userId: u.id, makeAdmin: true })}>
                    <Shield className="h-4 w-4 mr-1" /> Make admin
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

