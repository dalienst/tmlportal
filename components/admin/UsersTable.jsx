"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, FilterX, ShieldCheck } from "lucide-react";

function UsersTable({ users, refetch }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ role: "", search: "" });
    setCurrentPage(1);
  };

  const getRole = (user) => {
    if (user.is_superuser || user.is_admin) return "Admin";
    if (user.is_gm) return "GM";
    if (user.is_finance) return "Finance";
    if (user.is_manager) return "Manager";
    if (user.is_auditor) return "Auditor";
    if (user.is_it) return "IT";
    if (user.is_reservations) return "Reservations";
    if (user.is_employee) return "Employee";
    return "Staff";
  };

  const filteredUsers = users?.filter((user) => {
    const role = getRole(user).toLowerCase();
    const matchesRole = !filters.role || role === filters.role.toLowerCase();
    const matchesSearch = !filters.search || 
      user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.username?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  const totalItems = filteredUsers?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4 bg-white p-6 rounded-xl border border-border shadow-sm">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search" className="text-sm font-semibold">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name, email or username..."
              className="pl-10 bg-muted/20"
            />
          </div>
        </div>
        <div className="w-full md:w-48 space-y-2">
          <Label htmlFor="role" className="text-sm font-semibold">Filter by Role</Label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="w-full h-10 px-3 rounded-md border border-input bg-muted/20 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
            <option value="GM">GM</option>
            <option value="Auditor">Auditor</option>
            <option value="Reservations">Reservations</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="h-10 px-4 text-muted-foreground hover:text-foreground"
        >
          <FilterX className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold">Staff Member</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers?.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <TableRow key={user.id || user.identity || index} className="hover:bg-muted/10 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium bg-primary/5 text-primary border-primary/20">
                      {getRole(user)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-medium">{user.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No staff members found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="font-medium">{totalItems}</span> members
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Staff Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Full Name</p>
                  <p className="font-bold text-base">{selectedUser.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Username</p>
                  <p className="font-bold text-base">@{selectedUser.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Email</p>
                  <p className="font-bold">{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Staff Role</p>
                  <Badge className="w-fit">{getRole(selectedUser)}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Revenue Center</p>
                  <p className="font-bold">{selectedUser.revenue_center || 'Not Assigned'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Reference ID</p>
                  <code className="bg-muted px-1 rounded text-xs">{selectedUser.reference}</code>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-end">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>Close Profile</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default UsersTable;
