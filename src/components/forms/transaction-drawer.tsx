import { useIsMobile } from "@/hooks/use-mobile"
import { Transaksi } from "@/lib/api-client"
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

export const StatusTransaksi = {
  Created: 'dibuat',
  Ongoing: 'berlangsung',
  Cancelled: 'batal',
  Finished: 'selesai'
} as const;

export default function EditTransactionDrawer(
  { 
    idTransaksi, 
    onSave 
  }: { 
    idTransaksi: number
    onSave?: (updatedData: Transaksi) => void
  }
) {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = React.useState(false)

  const [formData, setFormData] = React.useState({
    idTransaksi: idTransaksi,
    status: "Completed"
  })
  const [transaction, setTransaction] = useState<Transaksi>({})

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const apiService = ApiService.getInstance()

  const handleSave = async () => {
    try {
      setIsLoading(true)

      const response = await apiService.transaksiApi.apiTransaksiIdPutRaw({ id: formData.idTransaksi, status: formData.status })

      if (!response.raw.ok) {
        throw new Error('Failed to update transaksi')
      }

      onSave?.({ ... transaction, ... formData })
      toast.success('Transaksi updated successfully')
      
    } catch (error) {
      console.error('Error updating transaksi:', error)
      toast.error('Failed to update transaksi')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    apiService.transaksiApi.apiTransaksiIdGet({ id: idTransaksi }).then(res => {
        setTransaction(res)
    })
  }, [])

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] sm:max-w-[500px]">
        <DrawerHeader>
          <DrawerTitle>Edit Transaction</DrawerTitle>
          <DrawerDescription>
            Make changes to transaction ID: {transaction.idTransaksi}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="grid gap-4 py-4">
            {/* TODO: ambil nama dari transaksi terlalu repot
            <div className="grid gap-2">
              <Label htmlFor="mitraName">Mitra Name</Label>
              <Input 
                id="mitraName" 
                value={transaction.motor?.mitra?.pengguna?.nama}
                onChange={(e) => handleChange('mitraName', e.target.value)}
              />
            </div> */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="registered">Register Date</Label>
              <Input 
                id="registered" 
                value={formData.registered}
                onChange={(e) => handleChange('registered', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="available">Available</Label>
              <Input 
                id="available" 
                value={formData.available}
                onChange={(e) => handleChange('available', e.target.value)}
              />
            </div> */}
            <div className="grid gap-2">
                {/* TODO: statusnya apa aja */}
              <Label htmlFor="payment">Payment Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleChange('payment', value)}
              >
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Waiting for Payment">Waiting for Payment</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button 
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
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
