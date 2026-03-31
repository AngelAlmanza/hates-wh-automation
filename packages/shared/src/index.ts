export enum EstadoPedido {
  Pendiente = 'PENDIENTE',
  EnPreparacion = 'EN_PREPARACION',
  ListoParaEntregar = 'LISTO_PARA_ENTREGAR',
  Entregado = 'ENTREGADO',
  Cancelado = 'CANCELADO',
}

export enum ModalidadEntrega {
  Recoger = 'RECOGER',
  Llevar = 'LLEVAR',
}

export interface ModificacionItem {
  descripcion: string;
}

export interface ItemPedido {
  nombre: string;
  cantidad: number;
  modificaciones: ModificacionItem[];
}

export interface Pedido {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  items: ItemPedido[];
  modalidad: ModalidadEntrega;
  estado: EstadoPedido;
  total: number;
  creadoEn: Date;
  actualizadoEn: Date;
}
