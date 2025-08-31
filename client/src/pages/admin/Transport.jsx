import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus, Clock, Plus, Edit, Users, Settings2 } from 'lucide-react';

export default function Transport() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Mock transport data
  const busRoutes = [
    { 
      id: 1,
      route: "Route A - North Zone", 
      driver: "John Smith", 
      students: 25, 
      status: "Active",
      busNumber: "SCH-001",
      capacity: 30,
      stops: ["Downtown", "Mall Area", "Residential Park"]
    },
    { 
      id: 2,
      route: "Route B - South Zone", 
      driver: "Emma Wilson", 
      students: 30, 
      status: "Active",
      busNumber: "SCH-002",
      capacity: 35,
      stops: ["Industrial Area", "City Center", "School Complex"]
    },
    { 
      id: 3,
      route: "Route C - East Zone", 
      driver: "Mike Johnson", 
      students: 22, 
      status: "Maintenance",
      busNumber: "SCH-003",
      capacity: 28,
      stops: ["Airport Road", "Business District", "Suburb Heights"]
    }
  ];

  const transportSchedule = [
    { time: "7:00 AM", route: "Route A", status: "On Time", location: "Downtown" },
    { time: "7:15 AM", route: "Route B", status: "Delayed", location: "City Center" },
    { time: "7:30 AM", route: "Route C", status: "Maintenance", location: "Depot" },
    { time: "8:00 AM", route: "Route A", status: "On Time", location: "School" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bus className="w-8 h-8" />
            Transport Management
          </h1>
          <p className="text-muted-foreground">Manage school bus routes and transportation</p>
        </div>
        <Button data-testid="button-add-route">
          <Plus className="w-4 h-4 mr-2" />
          Add New Route
        </Button>
      </div>

      {/* Transport Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card data-testid="card-total-buses">
          <CardHeader>
            <CardTitle className="text-lg">Total Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">2 active, 1 maintenance</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-students-transport">
          <CardHeader>
            <CardTitle className="text-lg">Students Using Transport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">77</div>
            <p className="text-sm text-muted-foreground">Out of 295 total students</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-routes">
          <CardHeader>
            <CardTitle className="text-lg">Active Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">Operating today</p>
          </CardContent>
        </Card>

        <Card data-testid="card-transport-efficiency">
          <CardHeader>
            <CardTitle className="text-lg">Efficiency Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <p className="text-sm text-muted-foreground">On-time performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bus Routes Management */}
        <Card data-testid="card-bus-routes">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="w-5 h-5" />
              Bus Routes Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {busRoutes.map((route, index) => (
                <div key={route.id} className="border rounded-lg p-4 space-y-3" data-testid={`route-${index}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{route.route}</p>
                      <p className="text-sm text-muted-foreground">Bus: {route.busNumber} • Driver: {route.driver}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={route.status === 'Active' ? 'default' : 'destructive'}>
                        {route.status}
                      </Badge>
                      <Button variant="outline" size="sm" data-testid={`button-edit-route-${index}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Students:</span>
                      <span className="ml-2 font-medium">{route.students}/{route.capacity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stops:</span>
                      <span className="ml-2 font-medium">{route.stops.length}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Route Stops:</span>
                    <p className="mt-1">{route.stops.join(" → ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transport Schedule */}
        <Card data-testid="card-transport-schedule">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Transport Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transportSchedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`schedule-${index}`}>
                  <div>
                    <p className="font-medium">{schedule.time}</p>
                    <p className="text-sm text-muted-foreground">{schedule.route}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      schedule.status === 'On Time' ? 'default' :
                      schedule.status === 'Delayed' ? 'secondary' : 'destructive'
                    }>
                      {schedule.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{schedule.location}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
              <Button variant="outline" className="w-full" data-testid="button-student-allocation">
                <Users className="w-4 h-4 mr-2" />
                Student Allocation
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-schedule-maintenance">
                <Settings2 className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Information */}
      <Card data-testid="card-driver-info">
        <CardHeader>
          <CardTitle>Driver Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {busRoutes.map((route, index) => (
              <div key={index} className="p-4 border rounded-lg" data-testid={`driver-${index}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-medium">
                      {route.driver.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{route.driver}</p>
                    <p className="text-sm text-muted-foreground">{route.route}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span>Bus: {route.busNumber}</span>
                  <Badge variant={route.status === 'Active' ? 'default' : 'destructive'}>
                    {route.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}