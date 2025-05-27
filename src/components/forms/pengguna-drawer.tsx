import { useIsMobile } from "@/hooks/use-mobile"
import { Pengguna, PostPelangganDTO, PostPenggunaDTO, StatusMitra, Transaksi } from "@/lib/api-client"
import ApiService from "@/lib/api-client/wrapper"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { IconLoader } from "@tabler/icons-react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "../ui/switch"
import { Separator } from "../ui/separator"
import { LoadingOverlay } from "../loading-overlay"

export default function EditPenggunaDrawer(
  { 
    idPengguna, 
    onSave,
    buttonText,
    editing=true 
  }: { 
    idPengguna: string
    onSave?: (updatedData: Pengguna) => void
    buttonText: string | undefined
    editing?: boolean
  }
) {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = React.useState(false)

  const [pengguna, setPengguna] = useState<Pengguna>({});
  const [loading, setLoading] = useState(true);

  const handleChange = (key: keyof Pengguna, value: any) => {
    setPengguna((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true)

      await apiService.penggunaApi.penggunaPut({ postPenggunaDTO: { ... pengguna as PostPenggunaDTO } })
      await apiService.mitraApi.mitraPut({ postMitraDTO: { ... pengguna.mitra } })
      await apiService.pelangganApi.pelangganPut({ postPelangganDTO: { ... pengguna.pelanggan as PostPelangganDTO } })

      // if (!response.raw.ok) {
      //   throw new Error('Failed to update transaksi')
      // }

      onSave?.({ ... pengguna })
      toast.success('Pengguna updated successfully')
      
    } catch (error) {
      console.error('Error updating pengguna:', error)
      toast.error('Failed to update pengguna')
    } finally {
      setIsLoading(false)
    }
  }

  const params = useParams();

  const apiService = ApiService.getInstance();

  const refresh = () => {
    setLoading(true);
    apiService.penggunaApi
      .penggunaIdGet({ id: idPengguna ?? "" })
      .then((res) => {
        setPengguna(res);
        setLoading(false);
      });
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} onOpenChange={() => refresh()}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {buttonText ?? idPengguna}
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" sm:max-w-[500px]">
        <DrawerHeader>
          <DrawerTitle>{editing ? "Edit User" : "User Detail"}</DrawerTitle>
          { editing ? <DrawerDescription>
            Make changes to pengguna ID: {idPengguna}
          </DrawerDescription> : ""}
        </DrawerHeader>
        <LoadingOverlay loading={loading}>
            <div className="p-4 space-y-4 overflow-y-auto">
          {/* <Card>
            <CardHeader>
              <CardTitle>Pengguna</CardTitle>
            </CardHeader>
            <CardContent> */}
            <div>
              <Label className="py-2" >Name:</Label>
              <Input
                value={pengguna.nama ?? ""}
                onChange={(e) => handleChange("nama", e.target.value)}
                readOnly={!editing}
              />
            </div>
            <div>
              <Label className="py-2">Date of birth:</Label>
              <Input
                type="date"
                value={
                  pengguna.tanggalLahir
                    ? new Date(pengguna.tanggalLahir).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => handleChange("tanggalLahir", e.target.value)}
                readOnly={!editing}
              />
            </div>
            <div>
              <Label className="py-2">Age:</Label>
              <Input
                type="number"
                value={pengguna.umur ?? ""}
                onChange={(e) => handleChange("umur", Number(e.target.value))}
                readOnly={!editing}
              />
            </div>
            <div>
              <Label className="py-2">Phone Number:</Label>
              <Input
                value={pengguna.nomorTelepon ?? ""}
                onChange={(e) => handleChange("nomorTelepon", e.target.value)}
                readOnly={!editing}
              />
            </div>
            <div>
              <Label className="py-2">Id Number:</Label>
              <Input
                value={pengguna.nomorKTP ?? ""}
                onChange={(e) => handleChange("nomorKTP", e.target.value)}
                readOnly={!editing}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={pengguna.isAdmin ?? false}
                onCheckedChange={(value) => handleChange("isAdmin", value)}
                disabled={!editing}
              />
              <Label className="py-2">Admin</Label>
            </div>
          {/* </CardContent>
        </Card> */}
        {pengguna.pelanggan && (
          // <Card>
          //   <CardHeader>
          //     <CardTitle>Pelanggan</CardTitle>
          //   </CardHeader>
          //   <CardContent>
              <div>
                <Separator />
                <div>
                  <Label className="py-2">Pelanggan ID:</Label>
                  <Input
                    value={pengguna.pelanggan.idPelanggan ?? ""}
                    onChange={(e) =>
                      setPengguna((prev) => ({
                        ...prev,
                        pelanggan: {
                          ...prev.pelanggan!,
                          idPelanggan: parseInt(e.target.value),
                        },
                      }))
                    }
                    readOnly={!editing}
                  />
                </div>
                <div>
                  <Label className="py-2">SIM Number:</Label>
                  <Input
                    value={pengguna.pelanggan.nomorSIM ?? ""}
                    onChange={(e) =>
                      setPengguna((prev) => ({
                        ...prev,
                        pelanggan: {
                          ...prev.pelanggan!,
                          nomorSIM: e.target.value,
                        },
                      }))
                    }
                    readOnly={!editing}
                  />
                </div>
                <p>
                  <Label className="py-2">Voucher Used Amount:</Label>{" "}
                  {pengguna.pelanggan.usedVouchers?.length ?? 0} voucher
                </p>
              </div>
          //   </CardContent>
          // </Card>
        )}
        {pengguna.mitra && (
          // <Card>
          //   <CardHeader>
          //     <CardTitle>Mitra</CardTitle>
          //   </CardHeader>
          //   <CardContent>
              <div>
                <Separator />
                <div>
                  <Label className="py-2">Id Mitra:</Label>
                  <Input value={pengguna.mitra.idMitra ?? ""} />
                </div>
                <div>
                  <Label className="py-2">Status:</Label>
                  <Select 
                    value={pengguna.mitra.status}
                    onValueChange={(value) => {
                      setPengguna({
                        ...pengguna,
                        mitra: {
                          ...pengguna.mitra,
                          status: value as StatusMitra
                        }
                      })
                    }}
                    disabled={!editing}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={StatusMitra.Aktif}>Active</SelectItem>
                      <SelectItem value={StatusMitra.NonAktif}>Non Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
          //   </CardContent>
          // </Card>
        )}
        {/* {pengguna.deviceTokens && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Device Tokens</h2>
              <p>{pengguna.deviceTokens?.length ?? 0} token</p>
            </CardContent>
          </Card>
        )} */}
    </div>
    </LoadingOverlay>
        <DrawerFooter>
        { editing ? <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button> : ""}
          <DrawerClose asChild>
            <Button variant="outline">{editing ? "Cancel": "Close"}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
