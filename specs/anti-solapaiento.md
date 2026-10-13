<!-- ejecuta @anti-solapamiento.md -->
# Spec: Funcion `verificarDisponibilidadTurno`

**Porposito:** Validar que un bloque de tiempo de 30 minutos esté libre para un medico específico antes de guardar.

**Entradas (Parametros):**
- `medicoID`:string (ObjectID válido)
- `fechaDeseada`: Date (ISO 8601)

**Logica de Negocio:**
1. Calcular `fechaFin` sumando 30 minutos a `fechaDeseada`
2. Consultar a Mongoose (modeo turno) si existe algun turno con estado 'pendiente' o 'atendido' para ese `medicoID` que se solape con la franja [fechaDeseada - fechaFin].
3. Un solapamiento oicurre si: 
    (turno.fecha < fechaFin) AND (turno.fechaFin > fechaDeseada).

**Salida:**
- Retorna: `true` si esta disponible y no hay solapamiento.
- Retorna: `false` si el bloque esta ocupado.