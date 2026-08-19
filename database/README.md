# Base de datos — Hotel Rayza

Motor: **MySQL 8+**, base de datos `hotel_management`.

## Archivos

| Archivo | Para qué |
|---------|----------|
| `01-schema.sql` | Crea la base de datos completa desde cero: todas las tablas, los datos base (roles, métodos de pago, tipos de habitación, servicios) y las columnas de Nubefact. **Este es el único archivo que se necesita para una instalación nueva.** |
| `migrations/` | Historial de cambios de esquema aplicados después del schema original. Solo referencia — `01-schema.sql` ya los incluye todos. |

## Instalación nueva (PC del hotel)

```
mysql -u root -p < 01-schema.sql
```

Ver la guía completa en `../INSTALACION.md`.

## Notas

- El usuario administrador (`admin` / `admin123`) **no** está en el SQL: lo crea
  el backend automáticamente la primera vez que arranca (ver `DataSeeder`).
- `ddl-auto=validate`: el backend valida que la base coincida exactamente con las
  entidades al arrancar. Si se agrega una entidad nueva, hay que actualizar el
  esquema o el backend no levantará.
