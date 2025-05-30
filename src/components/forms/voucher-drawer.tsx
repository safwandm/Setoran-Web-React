import { useIsMobile } from "@/hooks/use-mobile";
import { Voucher } from "@/lib/api-client/models/Voucher";
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
import { formatMotorName } from "@/lib/utils";
import { validateVoucher } from "@/app/vouchers/voucher-dialog";
import { PostVoucherDTO, StatusVoucher } from "@/lib/api-client";

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

export default function EditVoucherDrawer({
  idVoucher,
  onSave,
  buttonText,
  inDropdown = false
}: {
  idVoucher: number;
  onSave?: (updatedData: Voucher) => void;
  buttonText?: string;
  inDropdown?: boolean | null | undefined;
}) {
  const isMobile = useIsMobile();
  const [voucher, setVoucher] = useState<Voucher>({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const apiService = ApiService.getInstance();

  const refresh = () => {
    setLoading(true);
    apiService.voucherApi
      .voucherGenericIdGet({ id: idVoucher })
      .then((res) => {
        setVoucher(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleChange = (key: keyof Voucher, value: any) => {
    setVoucher((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
        setIsLoading(true);
        var err = await validateVoucher(voucher)
        if (Object.keys(err).length !== 0) {
            setErrors(err)
            return
        }
        await apiService.voucherApi.voucherIdVoucherPut({ idVoucher: idVoucher, postVoucherDTO: voucher as PostVoucherDTO});
        onSave?.({ ...voucher });
        toast.success("Voucher updated successfully");
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Failed to update voucher");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} onOpenChange={() => {refresh(); setErrors({})}}>
      <DrawerTrigger asChild>
        {inDropdown ? (
          <DropdownMenuItem>{buttonText ?? "Edit"}</DropdownMenuItem>
        ) : (
          <Button variant="link" className="text-foreground w-fit px-0 text-left">
            {buttonText ?? `Edit Voucher #${idVoucher}`}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[500px]">
        <DrawerHeader>
          <DrawerTitle>Edit Voucher</DrawerTitle>
          <DrawerDescription>Make changes to Voucher ID: {idVoucher}</DrawerDescription>
        </DrawerHeader>
        <LoadingOverlay loading={loading}>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <InputField
            name="namaVoucher"
            label="Name"
            value={voucher.namaVoucher ?? ""}
            onChange={(e) => handleChange("namaVoucher", e.target.value)}
            error={errors?.namaVoucher}
            />
            <div className="space-y-1">
                <Label htmlFor="statusVoucher">Status Voucher</Label>
                <Select
                    value={voucher.statusVoucher}
                    onValueChange={(e) => handleChange("statusVoucher", e)}
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
            <InputField
            name="tanggalMulai"
            label="Start Date"
            type="date"
            value={voucher.tanggalMulai ? voucher.tanggalMulai.toISOString().split("T")[0] : ""}
            onChange={(e) => handleChange("tanggalMulai", new Date(e.target.value))}
            error={errors?.tanggal}
            />
            <InputField
            name="tanggalAkhir"
            label="End Date"
            type="date"
            value={voucher.tanggalAkhir ? voucher.tanggalAkhir.toISOString().split("T")[0] : ""}
            onChange={(e) => handleChange("tanggalAkhir", new Date(e.target.value))}
            error={errors?.tanggal}
            />
            <InputField
            name="persenVoucher"
            label="Discount Percentage"
            type="number"
            value={voucher.persenVoucher ?? 0}
            onChange={(e) => handleChange("persenVoucher", Number(e.target.value))}
            error={errors?.persenVoucher}
            />
            <InputField
            name="kodeVoucher"
            label="Code"
            value={voucher.kodeVoucher ?? ""}
            onChange={(e) => handleChange("kodeVoucher", e.target.value)}
            error={errors?.kodeVoucher}
            />
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