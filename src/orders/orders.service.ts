import { Order } from './schemas/order.schema';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GetOrder, GetOrderItems } from './dto/get-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  private ordersDatabase: Order[];

  constructor(private readonly itemsService: ProductsService) {
    this.ordersDatabase = [];
  }

  /**
   * ;erge the various items creating a single object with the added quantities
   * @param {CreateOrderItemDto[]} products
   * @returns {CreateOrderItemDto[]}
   */
  private mergeProducts(products: CreateOrderItemDto[]): CreateOrderItemDto[] {
    return Object.values(
      products.reduce((acc, item) => {
        if (acc[item.product_id]) {
          acc[item.product_id].quantity += item.quantity;
        } else {
          acc[item.product_id] = { ...item };
        }
        return acc;
      }, {}),
    );
  }

  /**
   * Create and save a new order
   * @param {CreateOrderDto} createOrderDto
   * @returns {Promise<GetOrder>}
   */
  async create(createOrderDto: CreateOrderDto): Promise<GetOrder> {
    // merge duplicates
    const mergeItems: CreateOrderItemDto[] = this.mergeProducts(
      createOrderDto.order.items,
    );

    // Check if product_id exist
    for (const item of mergeItems) {
      const check = await this.itemsService.findOne(item.product_id);
      if (!check) {
        throw new BadRequestException(`Product ${item.product_id} not found`);
      }
    }

    const order: Order = {
      order_id: uuidv4(),
      items: mergeItems,
    };

    this.ordersDatabase.push(order);
    return this.findOne(order.order_id);
  }

  /**
   * Fint a order by id and return the order with all the price calculated
   * @param {string} id
   * @returns {Promise<GetOrder>}
   */
  async findOne(id: string): Promise<GetOrder> {
    // check if order exits

    const order = this.ordersDatabase.find((el) => el.order_id === id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    let order_price = 0;
    let order_vat = 0;

    // get all the product for the order
    const items: GetOrderItems[] = [];
    for (const it of order.items) {
      const item = await this.itemsService.findOne(it.product_id);

      if (!item) {
        throw new BadRequestException(`Item not found`);
      }

      order_price += it.quantity * item.price;
      order_vat += parseFloat((it.quantity * item.price * item.vat).toFixed(2));

      items.push({
        product_id: item.product_id,
        quantity: it.quantity,
        price: it.quantity * item.price,
        vat: parseFloat((it.quantity * item.price * item.vat).toFixed(2)),
      });
    }

    return {
      order_id: order.order_id,
      order_price,
      order_vat,
      items,
    };
  }

  /**
   * Update and existing order
   * @param {string} id
   * @param {UpdateOrderDto} updateOrderDto
   * @returns
   */
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<GetOrder> {
    if (updateOrderDto?.order?.items?.length === 0) {
      return this.findOne(id);
    }

    // Check if order exists
    const orderIndex = this.ordersDatabase.findIndex(
      (el) => el.order_id === id,
    );

    if (orderIndex === -1) {
      throw new NotFoundException('Order not found');
    }

    const mergeProducts = this.mergeProducts(updateOrderDto!.order!.items!);

    // Controlla se ogni prodotto esiste
    for (const item of mergeProducts) {
      const check = await this.itemsService.findOne(item.product_id);
      if (!check) {
        throw new BadRequestException(`Product ${item.product_id} not found`);
      }
    }

    this.ordersDatabase[orderIndex].items = mergeProducts;
    return this.findOne(id);
  }
}
