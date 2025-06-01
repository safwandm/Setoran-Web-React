// app/pengguna/[id]/page.tsx (or pages/pengguna/[id].tsx for Pages Router)
"use client" // if using App Router

import { useIsMobile } from "@/hooks/use-mobile"
import { Pengguna, PostPelangganDTO, PostPenggunaDTO, StatusMitra } from "@/lib/api-client"
import ApiService from "@/lib/api-client/wrapper"
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { IconLoader, IconUpload } from "@tabler/icons-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getGambar } from "@/lib/utils"
import Link from "next/link"
import { usetTitle } from "@/components/layout"

export function PenggunaInfoLink(
  { 
    idPengguna, 
    buttonText
  } : { 
    idPengguna: string,
    buttonText?: string
  }) {
    return (
      <Link href={`/users/${idPengguna}`}>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
            {buttonText ?? idPengguna}
        </Button>
      </Link>
    )
} 

export default function Page() {
  const setTitle = usetTitle()
  const { idPengguna }: { idPengguna: string } = useParams()
  const isMobile = useIsMobile()

  const [pengguna, setPengguna] = useState<Pengguna>({})
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const apiService = ApiService.getInstance()

  const refresh = () => {
    setLoading(true)
    apiService.penggunaApi.penggunaIdGet({ id: idPengguna }).then((res) => {
      setPengguna(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    setTitle("User Detail")
    refresh()
  }, [idPengguna])

  const handleChange = (key: keyof Pengguna, value: any) => {
    setPengguna((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault()
    try {
      setIsLoading(true)
      await apiService.penggunaApi.penggunaPut({ postPenggunaDTO: pengguna as PostPenggunaDTO })
      if (pengguna.mitra) await apiService.mitraApi.mitraPut({ postMitraDTO: pengguna.mitra })
      if (pengguna.pelanggan) await apiService.pelangganApi.pelangganPut({ postPelangganDTO: pengguna.pelanggan as PostPelangganDTO })
      toast.success("Pengguna updated successfully")
    } catch (error) {
      console.error("Error updating pengguna:", error)
      toast.error("Failed to update pengguna")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && pengguna.id) apiService.penggunaApi.penggunaUpdateProfileImageIdPost({ id: pengguna.id, file }).then(refresh)
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-6">
                <LoadingOverlay loading={loading}>
                  <div className="flex items-center gap-4">
                    <img
                      src={pengguna.idGambar != undefined ? getGambar(pengguna.nama!, pengguna.idGambar) : getGambar(pengguna.nama!, undefined)}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <Label htmlFor="avatar" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
                      <IconUpload className="h-4 w-4" />
                      Change Picture
                      <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                    </Label>
                  </div>
                  <div className="grid gap-4 pt-5">
                    <div className="grid gap-2">
                      <Label htmlFor="nama">Full Name</Label>
                      <Input id="nama" value={pengguna.nama ?? ""} onChange={(e) => handleChange("nama", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tanggalLahir">Date of Birth</Label>
                      <Input
                        id="tanggalLahir"
                        type="date"
                        value={pengguna.tanggalLahir ? new Date(pengguna.tanggalLahir).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleChange("tanggalLahir", new Date(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="umur">Age</Label>
                      <Input type="number" id="umur" value={pengguna.umur ?? ""} onChange={(e) => handleChange("umur", Number(e.target.value))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nomorTelepon">Phone Number</Label>
                      <Input id="nomorTelepon" value={pengguna.nomorTelepon ?? ""} onChange={(e) => handleChange("nomorTelepon", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nomorKTP">ID Number</Label>
                      <Input id="nomorKTP" value={pengguna.nomorKTP ?? ""} onChange={(e) => handleChange("nomorKTP", e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={pengguna.isAdmin ?? false} onCheckedChange={(value) => handleChange("isAdmin", value)} />
                      <Label>Admin</Label>
                    </div>
                  </div>

                  {pengguna.pelanggan && (
                    <div className="pt-6">
                      <Separator />
                      <div className="grid gap-2 pt-4">
                        <Label>Pelanggan ID</Label>
                        <Input value={pengguna.pelanggan.idPelanggan ?? ""} readOnly />
                        <Label>SIM Number</Label>
                        <Input
                          value={pengguna.pelanggan.nomorSIM ?? ""}
                          onChange={(e) =>
                            setPengguna((prev) => ({
                              ...prev,
                              pelanggan: { ...prev.pelanggan!, nomorSIM: e.target.value },
                            }))
                          }
                        />
                        <p>Voucher Used: {pengguna.pelanggan.usedVouchers?.length ?? 0}</p>
                      </div>
                    </div>
                  )}

                  {pengguna.mitra && (
                    <div className="pt-6">
                      <Separator />
                      <div className="grid gap-2 pt-4">
                        <Label>Id Mitra</Label>
                        <Input value={pengguna.mitra.idMitra ?? ""} readOnly />
                        <Label>Status</Label>
                        <Select
                          value={pengguna.mitra.status}
                          onValueChange={(value) =>
                            setPengguna((prev) => ({
                              ...prev,
                              mitra: { ...prev.mitra!, status: value as StatusMitra },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={StatusMitra.Aktif}>Active</SelectItem>
                            <SelectItem value={StatusMitra.NonAktif}>Non Active</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </LoadingOverlay>
              </CardContent>
              <CardFooter className="flex justify-end px-6 py-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <IconLoader className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}