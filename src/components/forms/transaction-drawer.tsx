import { useIsMobile } from "@/hooks/use-mobile";
import { Transaksi } from "@/lib/api-client/models/Transaksi"; // Adjust the import path as necessary
import ApiService from "@/lib/api-client/wrapper";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconLoader } from "@tabler/icons-react";
import { LoadingOverlay } from "../loading-overlay";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Pengguna } from "@/lib/api-client";
import { formatDateToLongDate, formatMotorName, formatPrice } from "@/lib/utils";

const InputField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  disabled
}: any) => (
  <div className="space-y-1">
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export const StatusTransaksi = {
  Created: 'dibuat',
  Ongoing: 'berlangsung',
  Cancelled: 'batal',
  Finished: 'selesai'
} as const;

export default function EditTransactionDrawer({
  idTransaksi,
  onSave,
  buttonText,
  inDropdown = false,
  editing=true ,
  initialData={}
}: {
  idTransaksi: number;
  onSave?: (updatedData: Transaksi) => void; // Adjust the type as necessary
  buttonText?: string;
  inDropdown?: boolean | null | undefined;
  editing?: boolean
  initialData?: Transaksi
}) {
  const isMobile = useIsMobile();
  const [transaksi, setTransaksi] = useState<Transaksi>(initialData);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const apiService = ApiService.getInstance();

  const refresh = () => {
    setLoading(true);
    // TODO: tidak efisien tapi endpoint ini yang load data motor dan pengguna
    apiService.transaksiApi
      .apiTransaksiGet()
      .then((res) => {
        res.forEach(itm => {
          if (itm.idTransaksi == idTransaksi) {
            setTransaksi(itm);
            setLoading(false);
          }
        })
      })
      .catch(() => setLoading(false));
  };

  const handleChange = (key: keyof Transaksi, value: any) => {
    setTransaksi((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await apiService.transaksiApi.apiTransaksiIdPut({ id: idTransaksi, status: transaksi.status! }); 
      onSave?.({ ...transaksi });
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} onOpenChange={() => { refresh(); setErrors({}) }}>
      <DrawerTrigger asChild>
        {inDropdown ? (
          <DropdownMenuItem>{buttonText ?? "Edit"}</DropdownMenuItem>
        ) : (
          <Button variant="link" className="text-foreground w-fit px-0 text-left">
            {buttonText ?? idTransaksi}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[500px]">
        <DrawerHeader>
          <DrawerTitle>{editing ? "Edit Transaction" : "Detail Transaction"}</DrawerTitle>
          <DrawerDescription>{editing && `Make changes to Transaction ID: ${idTransaksi}`}</DrawerDescription>
        </DrawerHeader>
        <LoadingOverlay loading={loading}>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <InputField
              name="userName"
              label="User Name"
              value={transaksi.pelanggan?.pengguna?.nama ?? ""}
              error={errors?.pelanggan?.pengguna?.nama}
              disabled={true}
            />
            <InputField
              name="mitraName"
              label="Motor owner anme"
              value={transaksi.motor?.mitra?.pengguna?.nama ?? ""}
              error={errors?.pelanggan?.pengguna?.nama}
              disabled={true}
            />
            <InputField
              name="idMotor"
              label="Motor ID"
              value={transaksi.idMotor ? transaksi.idMotor : ""}
              error={errors?.motor?.model}
              disabled={true}
            />
            <InputField
              name="motorName"
              label="Motor Name"
              value={transaksi.motor ? formatMotorName(transaksi.motor!) : ""}
              error={errors?.motor?.model}
              disabled={true}
            />
            <InputField
              name="rentalDate"
              label="Rental Date"
              value={formatDateToLongDate(transaksi.tanggalMulai) ?? ""}
              onChange={(e) => handleChange("tanggalMulai", e.target.value)}
              error={errors?.tanggalMulai}
              disabled={true}
            />
            <InputField
              name="returnDate"
              label="Return Date"
              value={formatDateToLongDate(transaksi.tanggalSelesai) ?? ""}
              onChange={(e) => handleChange("tanggalSelesai", e.target.value)}
              error={errors?.tanggalSelesai}
              disabled={true}
            />
            <InputField
              name="totalHarga"
              label="Total Harga"
              value={transaksi.totalHarga ? formatPrice(transaksi.totalHarga) : ""}
              disabled={true}
            />
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select value={transaksi.status ?? ""} onValueChange={(value) => handleChange("status", value)} disabled={!editing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(StatusTransaksi).map((key, index) => (
                    <SelectItem key={StatusTransaksi[key]} value={StatusTransaksi[key]}>{StatusTransaksi[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </LoadingOverlay>
        <DrawerFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}