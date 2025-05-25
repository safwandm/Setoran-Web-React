"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconTrash, IconUpload } from "@tabler/icons-react"

export default function SettingsPage() {
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    appName: "SeToRan",
    timezone: "Asia/Jakarta",
    logo: "/logo-placeholder.png"
  })

  // User Management State
  const [users, setUsers] = useState([
    { id: 1, name: "Admin 1", email: "admin1@example.com", role: "Super Admin" },
    { id: 2, name: "Admin 2", email: "admin2@example.com", role: "Admin" },
  ])

  // Payment Integration State
  const [paymentKeys, setPaymentKeys] = useState({
    midtransKey: "",
    stripeKey: "",
  })

  // Notification Template State
  const [emailTemplate, setEmailTemplate] = useState(`Dear {{name}},

Thank you for using our service.

Best regards,
{{appName}} Team`)

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    requireStrongPassword: true,
    ipWhitelist: "",
    maxLoginAttempts: 3
  })

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGeneralSettings(prev => ({
          ...prev,
          logo: reader.result as string
        }))
        toast.success("Logo updated successfully")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId))
    toast.success("User deleted successfully")
  }

  const handleBackupData = () => {
    toast.success("Backup started")
    // Add backup logic here
  }

  const handleExportData = () => {
    toast.success("Export started")
    // Add export logic here
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <h1 className="text-base font-medium">Settings</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col p-4 md:p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4 flex-wrap gap-2">
              <TabsTrigger value="general">⚙️ Sistem Umum</TabsTrigger>
              <TabsTrigger value="users">👥 Manajemen Pengguna</TabsTrigger>
              <TabsTrigger value="payments">💳 Pembayaran</TabsTrigger>
              <TabsTrigger value="notifications">📬 Template Notifikasi</TabsTrigger>
              <TabsTrigger value="data">📂 Data</TabsTrigger>
              <TabsTrigger value="security">🔐 Keamanan</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Sistem Umum</CardTitle>
                  <CardDescription>
                    Pengaturan umum aplikasi seperti nama, logo, dan zona waktu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={generalSettings.logo}
                      alt="Logo"
                      className="h-20 w-20 rounded-lg object-contain"
                    />
                    <Label
                      htmlFor="logo"
                      className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                    >
                      <IconUpload className="h-4 w-4" />
                      Ganti Logo
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </Label>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="appName">Nama Aplikasi</Label>
                    <Input
                      id="appName"
                      value={generalSettings.appName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, appName: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Zona Waktu</Label>
                    <Input
                      id="timezone"
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Manajemen Pengguna</CardTitle>
                  <CardDescription>
                    Kelola admin dan hak akses pengguna.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button>Tambah Admin</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-[100px]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Integrasi Pembayaran</CardTitle>
                  <CardDescription>
                    Konfigurasi payment gateway Midtrans dan Stripe.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="midtransKey">Midtrans Server Key</Label>
                    <Input
                      id="midtransKey"
                      type="password"
                      value={paymentKeys.midtransKey}
                      onChange={(e) => setPaymentKeys({ ...paymentKeys, midtransKey: e.target.value })}
                      placeholder="SK-XXXXX"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stripeKey">Stripe Secret Key</Label>
                    <Input
                      id="stripeKey"
                      type="password"
                      value={paymentKeys.stripeKey}
                      onChange={(e) => setPaymentKeys({ ...paymentKeys, stripeKey: e.target.value })}
                      placeholder="sk_test_XXXXX"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

           <TabsContent value="notifications">
            <Card>
                <CardHeader>
                <CardTitle>Template Notifikasi</CardTitle>
                <CardDescription>
                    Kustomisasi template email notifikasi.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid gap-2">
                    <Label htmlFor="emailTemplate">Template Email</Label>
                    <textarea
                    id="emailTemplate"
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                    Variabel yang tersedia: {"{{name}}, {{appName}}"}
                    </p>
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Manajemen Data</CardTitle>
                  <CardDescription>
                    Backup dan export data aplikasi.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button onClick={handleBackupData}>
                      Backup Data
                    </Button>
                    <Button onClick={handleExportData}>
                      Export Data
                    </Button>
                    <Button variant="destructive">
                      Hapus Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Keamanan</CardTitle>
                  <CardDescription>
                    Pengaturan keamanan dan akses aplikasi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="strongPassword"
                      checked={securitySettings.requireStrongPassword}
                      onChange={(e) => 
                        setSecuritySettings({
                          ...securitySettings,
                          requireStrongPassword: e.target.checked
                        })
                      }
                    />
                    <Label htmlFor="strongPassword">Wajib Password Kuat</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                    <Input
                      id="ipWhitelist"
                      value={securitySettings.ipWhitelist}
                      onChange={(e) => 
                        setSecuritySettings({
                          ...securitySettings,
                          ipWhitelist: e.target.value
                        })
                      }
                      placeholder="192.168.1.1, 10.0.0.1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxAttempts">Batas Percobaan Login</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => 
                        setSecuritySettings({
                          ...securitySettings,
                          maxLoginAttempts: parseInt(e.target.value)
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}