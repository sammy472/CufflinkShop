import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'wouter';
import { type Order, type Product } from '@shared/schema';
import { ShoppingCart, DollarSign, Package, Users, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      setLocation('/admin');
      return;
    }
    setAdmin(JSON.parse(adminData));
  }, [setLocation]);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    enabled: !!admin,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: !!admin,
  });

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setLocation('/admin');
  };

  if (!admin) {
    return null; // Will redirect to login
  }

  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + parseFloat(order.total), 0);

  const totalCustomers = new Set(orders.map(order => order.customerEmail)).size;

  return (
    <div className="min-h-screen bg-background transition-theme">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
            Admin Dashboard
          </h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-2xl font-bold text-card-foreground" data-testid="text-stat-orders">
                    {orders.length}
                  </h4>
                  <p className="text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-2xl font-bold text-card-foreground" data-testid="text-stat-revenue">
                    ${totalRevenue.toFixed(0)}
                  </h4>
                  <p className="text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-2xl font-bold text-card-foreground" data-testid="text-stat-products">
                    {products.length}
                  </h4>
                  <p className="text-muted-foreground">Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-2xl font-bold text-card-foreground" data-testid="text-stat-customers">
                    {totalCustomers}
                  </h4>
                  <p className="text-muted-foreground">Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-recent-orders-title">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8" data-testid="text-no-orders">
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                        <TableCell className="font-mono text-sm" data-testid={`text-order-id-${order.id}`}>
                          #{order.id.slice(-8)}
                        </TableCell>
                        <TableCell data-testid={`text-order-customer-${order.id}`}>
                          {order.customerFirstName} {order.customerLastName}
                        </TableCell>
                        <TableCell className="font-semibold" data-testid={`text-order-total-${order.id}`}>
                          ${order.total}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                            data-testid={`badge-order-status-${order.id}`}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                          {new Date(order.createdAt || new Date()).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
