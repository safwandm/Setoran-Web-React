import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { PostVoucherDTO, StatusVoucher, Voucher } from "@/lib/api-client";
import { IconPlus } from "@tabler/icons-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ApiService from "@/lib/api-client/wrapper";
import { toast } from "sonner";

// Input field component
const InputField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
}: any) => (
  <div className="space-y-1">
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export function TambahVoucherDialog({ refresh=() => {} }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<PostVoucherDTO>({
    kodeVoucher: "",
    namaVoucher: "",
    persenVoucher: 0,
    statusVoucher: StatusVoucher.Aktif,
    tanggalMulai: new Date(),
    tanggalAkhir: new Date(Date.now() + 86400000),
  });
  const [dateRangeValue, setDateRangeValue] = useState({
    from: new Date(),
    to: new Date(Date.now() + 86400000),
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: StatusVoucher) => {
    setFormData({ ...formData, statusVoucher: value });
  };

  const apiService = ApiService.getInstance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let data: PostVoucherDTO = {
        ...formData,
        tanggalMulai: dateRangeValue.from,
        tanggalAkhir: dateRangeValue.to
    }

    var err = await validateVoucher(data)
    if (Object.keys(err).length !== 0) {
        setErrors(err)
        return
    }

    apiService.voucherApi.voucherPost({ postVoucherDTO: data }).then(() => {
      toast("Voucher successfully added")
      refresh()
      setOpen(false)
    }).catch(err => {
      toast.error("Failed to add voucher")
      console.log(err)
    })
  };

  return (
    <Dialog open={open}>
      <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => {setOpen(true)}}>
        <IconPlus />
        <span className="hidden lg:inline">Add Voucher</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Voucher</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <InputField
                name="kodeVoucher"
                label="Kode Voucher"
                value={formData.kodeVoucher}
                onChange={handleChange}
                error={errors.kodeVoucher}
              />
              <InputField
                name="namaVoucher"
                label="Nama Voucher"
                value={formData.namaVoucher}
                onChange={handleChange}
                error={errors.namaVoucher}
              />
              <InputField
                name="persenVoucher"
                label="Persen Voucher"
                type="number"
                value={formData.persenVoucher}
                onChange={handleChange}
                error={errors.persenVoucher}
              />
              <div className="space-y-1">
                <Label htmlFor="statusVoucher">Status Voucher</Label>
                <Select
                  value={formData.statusVoucher}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="statusVoucher">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(StatusVoucher).map(([key, val]) => (
                      <SelectItem key={key} value={key}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Tanggal Aktif Voucher</Label>
                <DatePickerWithRange
                  date={dateRangeValue}
                  setDate={setDateRangeValue}
                />
                {errors.tanggal && (
                  <p className="text-sm text-red-600">{errors.tanggal}</p>
                )}
              </div>
              <div className="flex justify-center mt-4 gap-5">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export async function validateVoucher(formData: Voucher) {
    let errors: any = {}

    if (!formData.kodeVoucher) {
        errors.kodeVoucher = "Required!"
    } else {
        try {
            var res = await ApiService.getInstance().voucherApi.voucherGetByCodeCodeGet({ code: formData.kodeVoucher })
            if (res.idVoucher != formData?.idVoucher)
                errors.kodeVoucher = "Kode voucher sudah digunakan"
        } catch (error) {
            // nothing
        }
    }
    
    if (!formData.tanggalMulai) {
        errors.tanggalMulai = "Required!"
    }
    if (!formData.namaVoucher) {
        errors.namaVoucher = "Required!"
    }

    if (!formData.persenVoucher) {
        errors.persenVoucher = "Required!"
    } else if (formData.persenVoucher <= 0 || formData.persenVoucher>100) {
        errors.persenVoucher = "Persen voucher harus di antara 1 dan 100 persen"
    }

    return errors
}