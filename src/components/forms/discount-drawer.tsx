import { useIsMobile } from "@/hooks/use-mobile";
import { Diskon } from "@/lib/api-client";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconLoader } from "@tabler/icons-react";
import { LoadingOverlay } from "../loading-overlay";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { formatMotorName } from "@/lib/utils";

export default function EditDiskonDrawer({
  idDiskon,
  onSave,
  buttonText,
  inDropdown=false
}: {
  idDiskon: number;
  onSave?: (updatedData: Diskon) => void;
  buttonText?: string;
  inDropdown?: boolean | null | undefined
}) {
  const isMobile = useIsMobile();
  const [diskon, setDiskon] = useState<Diskon>({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const apiService = ApiService.getInstance();

  const refresh = () => {
    setLoading(true);
    apiService.diskonApi
      .diskonGenericIdGet({ id: idDiskon })
      .then((res) => {
        setDiskon(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleChange = (key: keyof Diskon, value: any) => {
    setDiskon((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await apiService.diskonApi.diskonPut({ putDiskonDTO: diskon });
      onSave?.({ ...diskon });
      toast.success("Diskon updated successfully");
    } catch (error) {
      console.error("Error updating diskon:", error);
      toast.error("Failed to update diskon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} onOpenChange={refresh}>
      <DrawerTrigger asChild>
        { inDropdown ? (<DropdownMenuItem>{buttonText ?? "Edit"}</DropdownMenuItem>) : (
          <Button variant="link" className="text-foreground w-fit px-0 text-left">
            {buttonText ?? `Edit Diskon #${idDiskon}`}
          </Button>
          )
        }
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[500px]">
        <DrawerHeader>
          <DrawerTitle>Edit Diskon</DrawerTitle>
          <DrawerDescription>Make changes to Discount ID: {idDiskon}</DrawerDescription>
        </DrawerHeader>
        <LoadingOverlay loading={loading}>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div>
              <Label className="py-2">Name:</Label>
              <Input
                value={diskon.nama ?? ""}
                onChange={(e) => handleChange("nama", e.target.value)}
              />
            </div>
            <div>
              <Label className="py-2">Description:</Label>
              <Input
                value={diskon.deskripsi ?? ""}
                onChange={(e) => handleChange("deskripsi", e.target.value)}
              />
            </div>
            <div>
              <Label className="py-2">For Motor Id:</Label>
              <Input
                value={diskon.idMotor}
                readOnly={true}
              />
            </div>
            <div>
              <Label className="py-2">Discount amount:</Label>
              <Input
                type="number"
                value={diskon.jumlahDiskon ?? 0}
                onChange={(e) => handleChange("jumlahDiskon", Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="py-2">Start Date:</Label>
              <Input
                type="date"
                value={diskon.tanggalMulai ? new Date(diskon.tanggalMulai).toISOString().split("T")[0] : ""}
                onChange={(e) => handleChange("tanggalMulai", new Date(e.target.value))}
              />
            </div>
            <div>
              <Label className="py-2">End Date:</Label>
              <Input
                type="date"
                value={diskon.tanggalAkhir ? new Date(diskon.tanggalAkhir).toISOString().split("T")[0] : ""}
                onChange={(e) => handleChange("tanggalAkhir", new Date(e.target.value))}
              />
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
