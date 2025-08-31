import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings2, 
  Building, 
  Users, 
  Calendar, 
  Megaphone, 
  Shield, 
  Download, 
  BarChart3,
  Database,
  Wifi,
  HardDrive
} from 'lucide-react';

export default function SystemSettings() {
  // Mock system data
  const systemStatus = {
    uptime: "99.8%",
    performance: "Excellent",
    storage: "78% used",
    activeSessions: 142,
    lastBackup: "2024-03-10 02:00:00"
  };

  const systemModules = [
    { name: "Student Management", status: "Active", version: "v2.1.0", lastUpdated: "2024-03-01" },
    { name: "Teacher Portal", status: "Active", version: "v1.8.5", lastUpdated: "2024-02-28" },
    { name: "Fee Management", status: "Active", version: "v1.5.2", lastUpdated: "2024-03-05" },
    { name: "Transport System", status: "Maintenance", version: "v1.3.1", lastUpdated: "2024-02-15" },
    { name: "Digital Library", status: "Active", version: "v2.0.0", lastUpdated: "2024-03-08" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="w-8 h-8" />
            System Settings
          </h1>
          <p className="text-muted-foreground">Configure system preferences and manage school settings</p>
        </div>
        <Button data-testid="button-export-settings">
          <Download className="w-4 h-4 mr-2" />
          Export Configuration
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card data-testid="card-system-uptime">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{systemStatus.uptime}</div>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card data-testid="card-performance">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{systemStatus.performance}</div>
            <p className="text-sm text-muted-foreground">Response time: 0.8s</p>
          </CardContent>
        </Card>

        <Card data-testid="card-storage">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{systemStatus.storage}</div>
            <p className="text-sm text-muted-foreground">156 GB / 200 GB</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-sessions">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{systemStatus.activeSessions}</div>
            <p className="text-sm text-muted-foreground">Current users online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card data-testid="card-general-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" data-testid="button-school-info">
                <Building className="w-4 h-4 mr-2" />
                School Information
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-user-roles">
                <Users className="w-4 h-4 mr-2" />
                User Roles & Permissions
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-academic-year">
                <Calendar className="w-4 h-4 mr-2" />
                Academic Year Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-notifications">
                <Megaphone className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Backup */}
        <Card data-testid="card-security-backup">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground">{systemStatus.lastBackup}</p>
              </div>
              <Button className="w-full" data-testid="button-create-backup">
                <Download className="w-4 h-4 mr-2" />
                Create System Backup
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-security-audit">
                <Shield className="w-4 h-4 mr-2" />
                Run Security Audit
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-access-logs">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Access Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Modules */}
      <Card data-testid="card-system-modules">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemModules.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`module-${index}`}>
                <div>
                  <p className="font-medium">{module.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Version {module.version} • Last updated: {module.lastUpdated}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={module.status === 'Active' ? 'default' : 'secondary'}>
                    {module.status}
                  </Badge>
                  <Button variant="outline" size="sm" data-testid={`button-configure-${index}`}>
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card data-testid="card-quick-settings">
        <CardHeader>
          <CardTitle>Quick Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-database-settings">
              <Database className="w-6 h-6" />
              <span className="text-sm">Database Settings</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-email-config">
              <Megaphone className="w-6 h-6" />
              <span className="text-sm">Email Configuration</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-api-settings">
              <Settings2 className="w-6 h-6" />
              <span className="text-sm">API Settings</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-maintenance-mode">
              <Shield className="w-6 h-6" />
              <span className="text-sm">Maintenance Mode</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}