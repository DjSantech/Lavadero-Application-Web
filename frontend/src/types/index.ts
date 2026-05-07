// src/types/index.ts

export type EstadoMoto = 'espera' | 'lavando' | 'listo' | 'entregado';

export interface Moto {
  id?: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: 'scooter' | 'alto_cilindraje' | 'trabajo' | 'calle';
  clienteNombre?: string;
  clienteTelefono?: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
}

export interface Ticket {
  id?: string;
  moto: Moto;
  servicio: Servicio;
  fechaEntrada: Date;
  fechaSalida?: Date;
  estado: EstadoMoto;
  total: number;
}