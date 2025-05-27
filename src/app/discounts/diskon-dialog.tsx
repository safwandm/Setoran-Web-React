import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
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
import { DatePickerWithRange } from "@/components/date-range-picker";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import ApiService from "@/lib/api-client/wrapper";
import { StatusDiskon, PostDiskonDTO, Diskon, Motor } from "@/lib/api-client";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn, formatMotorName } from "@/lib/utils"

const InputField = ({ name, label, type = "text", value, onChange, error }: any) => (
  <div className="space-y-1">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} name={name} type={type} value={value} onChange={onChange} />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export function TambahDiskonDialog({ refresh = () => {} }) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PostDiskonDTO>({
    idMotor: undefined,
    nama: "",
    deskripsi: "",
    jumlahDiskon: 0,
    statusDiskon: StatusDiskon.Aktif,
    tanggalMulai: new Date(),
    tanggalAkhir: new Date(Date.now() + 86400000),
  });
  const [dateRangeValue, setDateRangeValue] = useState({
    from: new Date(),
    to: new Date(Date.now() + 86400000),
  });
  const [errors, setErrors] = useState<any>({});
  const apiService = ApiService.getInstance();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeGeneric = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: PostDiskonDTO = {
      ...formData,
      tanggalMulai: dateRangeValue.from,
      tanggalAkhir: dateRangeValue.to,
    };

    const err = await validateDiscount(data);
    if (Object.keys(err).length !== 0) {
      setErrors(err);
      return;
    }

    setLoading(true)
    apiService.diskonApi.diskonPost({ postDiskonDTO: data })
      .then(() => {
        toast("Diskon berhasil ditambahkan");
        refresh();
        setOpen(false);
        setLoading(false)
      })
      .catch((err) => {
        toast.error("Gagal menambahkan diskon");
        console.log(err);
        setLoading(false)
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        <IconPlus />
        <span className="hidden lg:inline">Tambah Diskon</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Diskon</DialogTitle>
          {/* <DialogDescription>
            
          </DialogDescription> */}
        </DialogHeader>
        <LoadingOverlay loading={loading}>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <MotorSelector selectMotor={(id) => handleChangeGeneric("idMotor", id)}/>
              <InputField
                name="nama"
                label="Nama Diskon"
                value={formData.nama}
                onChange={handleChange}
                error={errors.nama}
              />
              <InputField
                name="deskripsi"
                label="Deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                error={errors.deskripsi}
              />
              <InputField
                name="jumlahDiskon"
                label="Jumlah Diskon"
                type="number"
                value={formData.jumlahDiskon}
                onChange={handleChange}
                error={errors.jumlahDiskon}
              />
              <div className="space-y-1">
                <Label htmlFor="statusDiskon">Status Diskon</Label>
                <Select value={formData.statusDiskon} onValueChange={(e) => handleChangeGeneric("statusDiskon", e)}>
                  <SelectTrigger id="statusDiskon">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(StatusDiskon).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Tanggal Aktif Diskon</Label>
                <DatePickerWithRange date={dateRangeValue} setDate={setDateRangeValue} />
                {errors.tanggal && <p className="text-sm text-red-600">{errors.tanggal}</p>}
              </div>
              <div className="flex justify-center mt-4 gap-5">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
        </LoadingOverlay>
      </DialogContent>
    </Dialog>
  );
}

export async function validateDiscount(formData: PostDiskonDTO) {
  const errors: any = {};

  if (!formData.nama) {
    errors.nama = "Required!";
  }

  if (!formData.jumlahDiskon || formData.jumlahDiskon <= 0) {
    errors.jumlahDiskon = "Diskon harus di atas 0";
  }

  if (!formData.tanggalMulai || !formData.tanggalAkhir) {
    errors.tanggal = "Required!"
  }

  return errors;
}

export function MotorSelector({ selectMotor }: { selectMotor: (motor: number) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [motors, setMotors] = useState<Motor[]>([])
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null)
  const apiService = ApiService.getInstance()

  useEffect(() => {
    setLoading(true)
    apiService.motorApi.apiMotorGet().then(res => {
      setMotors(res)
      setLoading(false)
    })
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedMotor ? `Id: ${selectedMotor.idMotor} Nama: ${formatMotorName(selectedMotor)}` : "Select motor"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search motor..." />
          <CommandEmpty>{loading ? "Loading..." : "No motor found."}</CommandEmpty>
          <CommandGroup>
            {motors.map((motor) => {
                const nama = `Id: ${motor.idMotor} Nama: ${formatMotorName(motor)}`
                return (
                    <CommandItem
                        key={nama}
                        value={nama}
                        onSelect={() => {
                        setSelectedMotor(motor)
                        selectMotor(motor.idMotor!)
                        setOpen(false)
                        }}
                    >
                        <Check
                          className={cn(
                              "mr-2 h-4 w-4",
                              selectedMotor?.idMotor === motor.idMotor ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {nama}
                    </CommandItem>
            )})}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
