SELECT r.id_reserva,
       c.nombre || ' ' || c.apellido AS cliente,
       h.numero_habitacion,
       h.tipo,
       r.fecha_checkin,
       r.fecha_checkout,
       p.monto_total AS pago,
       p.estado_pago,
       s.nombre AS servicio_extra,
       rs.cantidad
FROM Reserva r
JOIN Cliente c ON r.id_cliente = c.id_cliente
JOIN Habitacion h ON r.id_habitacion = h.id_habitacion
LEFT JOIN Pago p ON r.id_reserva = p.id_reserva
LEFT JOIN Reserva_Servicio rs ON r.id_reserva = rs.id_reserva
LEFT JOIN Servicio s ON rs.id_servicio = s.id_servicio;
