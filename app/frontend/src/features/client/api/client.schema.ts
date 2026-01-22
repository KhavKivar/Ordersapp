import z from "zod";

export const clientSchema = z.object({
  id: z.string(),
  name: z.string().nonempty("El nombre es obligatorio"),
  localName: z.string().nonempty("El nombre del local es obligatorio"),
  address: z.string().nonempty("La direccion es obligatoria"),
  phone: z.string().min(5, "El telefono debe tener al menos 5 caracteres"),
});

export type Client = z.infer<typeof clientSchema>;
