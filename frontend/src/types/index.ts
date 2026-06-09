export type EstadoMoto = 'en espera' | 'lavando' | 'listo' | 'entregado';
export type TipoMoto = 'Scooter' | 'Calle' | 'Alto Cilindraje' | 'Enduro';

export interface TicketDB {
  _id: string;
  placa: string;
  tipoMoto: TipoMoto;
  horaEntrada: string;
  horaSalidaEstimada?: string;
  dejoCasco: boolean;
  observaciones?: string;
  fecha: string;
  estado: EstadoMoto;
  precio: number;
}

export interface NuevoTicket {
  placa: string;
  tipoMoto: TipoMoto;
  horaEntrada: string;
  horaSalidaEstimada?: string;
  dejoCasco: boolean;
  observaciones?: string;
  precio: number;
}

export interface Stats {
  totalVentas: number;
  totalMotos: number;
  flujoPorDia: { name: string; total: number }[];
  mejorDia: string | null;
  horaMasConcurrida: string | null;
}
