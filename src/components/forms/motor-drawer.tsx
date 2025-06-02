import { useIsMobile } from "@/hooks/use-mobile";
import { Motor } from "@/lib/api-client/models/Motor";
import ApiService, { BASE_PATH } from "@/lib/api-client/wrapper";
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconLoader } from "@tabler/icons-react";
import { LoadingOverlay } from "../loading-overlay";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { PutMotorDTO } from "@/lib/api-client";

const InputField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  disabled,
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

export const StatusMotor = {
  Available: "Tersedia",
  Rented: "Disewa",
  Reserved: "Dipesan",
  UnderMaintenance: "Dalam Perbaikan",
  NotAvailable: "Tidak Tersedia",
  Filed: "Diajukan",
} as const;

export const TransmisiMotor = {
  Automatic: "Matic",
  Manual: "Manual",
} as const;

export default function EditMotorDrawer({
  idMotor,
  onSave,
  buttonText,
  inDropdown = false,
  editing = true,
}: {
  idMotor: number;
  onSave?: (updatedData: Motor) => void;
  buttonText?: string;
  inDropdown?: boolean | null | undefined;
  editing?: boolean;
}) {
  const isMobile = useIsMobile();
  const [motor, setMotor] = useState<Motor>({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const apiService = ApiService.getInstance();

  const refresh = () => {
    setLoading(true);
    apiService.motorApi
      .apiMotorIdGet({ id: idMotor })
      .then((res) => {
        // tidak optimal
        if (res.idMotorImage) {
          apiService.motorImageApi
            .apiMotorImageIdGet({ id: res.idMotorImage })
            .then((img) => {
              res.motorImage = img;
              setMotor(res);
              setLoading(false);
            });
        } else {
          setMotor(res);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  const handleChange = (key: keyof Motor, value: any) => {
    setMotor((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      //   var err = await validateMotor(motor); // Assuming you have a validateMotor function
      //   if (Object.keys(err).length !== 0) {
      //     setErrors(err);
      //     return;
      //   }
      await apiService.motorApi.apiMotorIdPut({
        id: idMotor,
        putMotorDTO: motor as PutMotorDTO,
      });
      onSave?.({ ...motor });
      toast.success("Motor updated successfully");
    } catch (error) {
      console.error("Error updating motor:", error);
      toast.error("Failed to update motor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      onOpenChange={() => {
        refresh();
        setErrors({});
      }}
    >
      <DrawerTrigger asChild>
        {inDropdown ? (
          <DropdownMenuItem>{buttonText ?? "Edit"}</DropdownMenuItem>
        ) : (
          <Button
            variant="link"
            className="text-foreground w-fit px-0 text-left"
          >
            {buttonText ?? idMotor}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-[50%] sm:max-w-[500px] overflow-y-scroll">
        <DrawerHeader>
          <DrawerTitle>{editing ? "Edit Motor" : "Detail Motor"}</DrawerTitle>
          <DrawerDescription>
            {editing && `Make changes to Motor ID: ${idMotor}`}
          </DrawerDescription>
        </DrawerHeader>
        <LoadingOverlay loading={loading}>
          {motor.motorImage && (
            <div className="w-full flex justify-center">
              <Carousel className="w-[60%]">
                <CarouselContent>
                  {/* {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold">{index + 1}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))} */}
                  <CarouselItem>
                    {motor.motorImage.right && (
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img
                              src={`${BASE_PATH}/storage/fetch/${motor.motorImage?.right}`}
                            />
                          </CardContent>
                          <CardFooter className="flex justify-center">
                            <Label>Right</Label>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </CarouselItem>
                  <CarouselItem>
                    {motor.motorImage.front && (
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img
                              src={`${BASE_PATH}/storage/fetch/${motor.motorImage?.front}`}
                            />
                          </CardContent>
                          <CardFooter className="flex justify-center">
                            <Label>Front</Label>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </CarouselItem>
                  <CarouselItem>
                    {motor.motorImage.left && (
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img
                              src={`${BASE_PATH}/storage/fetch/${motor.motorImage?.left}`}
                            />
                          </CardContent>
                          <CardFooter className="flex justify-center">
                            <Label>Left</Label>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </CarouselItem>
                  <CarouselItem>
                    {motor.motorImage.rear && (
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img
                              src={`${BASE_PATH}/storage/fetch/${motor.motorImage?.rear}`}
                            />
                          </CardContent>
                          <CardFooter className="flex justify-center">
                            <Label>Rear</Label>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <InputField
              name="platNomor"
              label="License Plate Number"
              value={motor.platNomor ?? ""}
              onChange={(e) => handleChange("platNomor", e.target.value)}
              error={errors?.platNomor}
              disabled={!editing}
            />
            {/* Add other InputFields for Motor properties */}
            <InputField
              name="nomorSTNK"
              label="STNK Number"
              value={motor.nomorSTNK ?? ""}
              onChange={(e) => handleChange("nomorSTNK", e.target.value)}
              error={errors?.nomorSTNK}
              disabled={!editing}
            />
            <InputField
              name="nomorBPKB"
              label="BPKB Number"
              value={motor.nomorBPKB ?? ""}
              onChange={(e) => handleChange("nomorBPKB", e.target.value)}
              error={errors?.nomorBPKB}
              disabled={!editing}
            />
            <InputField
              name="model"
              label="Model"
              value={motor.model ?? ""}
              onChange={(e) => handleChange("model", e.target.value)}
              error={errors?.model}
              disabled={!editing}
            />
            <InputField
              name="brand"
              label="Brand"
              value={motor.brand ?? ""}
              onChange={(e) => handleChange("brand", e.target.value)}
              error={errors?.brand}
              disabled={!editing}
            />
            <InputField
              name="tipe"
              label="Type"
              value={motor.tipe ?? ""}
              onChange={(e) => handleChange("tipe", e.target.value)}
              error={errors?.tipe}
              disabled={!editing}
            />
            <InputField
              name="tahun"
              label="Year"
              type="number"
              value={motor.tahun ?? 0}
              onChange={(e) => handleChange("tahun", parseInt(e.target.value))}
              error={errors?.tahun}
              disabled={!editing}
            />
            <div className="space-y-1">
              <Label htmlFor="transmisi">Transmission</Label>
              <Select
                value={motor.transmisi || ""}
                onValueChange={(value) => handleChange("transmisi", value)}
                disabled={!editing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(TransmisiMotor).map((key, index) => (
                    <SelectItem
                      key={TransmisiMotor[key]}
                      value={TransmisiMotor[key]}
                    >
                      {TransmisiMotor[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="statusMotor">Status</Label>
              <Select
                value={motor.statusMotor || ""}
                onValueChange={(value) => handleChange("statusMotor", value)}
                disabled={!editing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(StatusMotor).map((key, index) => (
                    <SelectItem key={StatusMotor[key]} value={StatusMotor[key]}>
                      {StatusMotor[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <InputField
              name="hargaHarian"
              label="Daily Price"
              type="number"
              value={motor.hargaHarian ?? 0}
              onChange={(e) =>
                handleChange("hargaHarian", parseInt(e.target.value))
              }
              error={errors?.hargaHarian}
              disabled={!editing}
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

function validateMotor(motor: Motor) {
  const errors = {};

  if (!motor.platNomor || motor.platNomor.length > 9) {
    errors["platNomor"] =
      "License Plate Number is required and must not exceed 9 characters.";
  }

  if (!motor.nomorSTNK) {
    errors["nomorSTNK"] = "STNK Number is required.";
  }

  if (!motor.nomorBPKB) {
    errors["nomorBPKB"] = "BPKB Number is required.";
  }

  if (!motor.model) {
    errors["model"] = "Model is required.";
  }

  if (!motor.brand) {
    errors["brand"] = "Brand is required.";
  }

  if (!motor.tipe) {
    errors["tipe"] = "Type is required.";
  }

  if (!motor.tahun || isNaN(motor.tahun)) {
    errors["tahun"] = "Year is required and must be a number.";
  } else if (motor.tahun <= 0) {
    errors["tahun"] = "Year must be a positive number.";
  }

  if (!motor.transmisi) {
    errors["transmisi"] = "Transmission is required.";
  }

  if (!motor.statusMotor) {
    errors["statusMotor"] = "Status is required.";
  }

  if (!motor.hargaHarian || isNaN(motor.hargaHarian)) {
    errors["hargaHarian"] = "Daily Price is required and must be a number.";
  } else if (motor.hargaHarian <= 0) {
    errors["hargaHarian"] = "Daily Price must be a positive number.";
  }

  return errors;
}
