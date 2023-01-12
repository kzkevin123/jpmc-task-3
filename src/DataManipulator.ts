import { ServerRespond } from './DataStreamer';

export interface Row {
  stock: string,
  top_ask_price: number,
  timestamp: Date,
  stock_ratio: number,
  upper_bound: number,
  lower_bound: number,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    let stock_data: Map<string, number> = new Map<string, number>();
    serverResponds.forEach((el: any) => {
      stock_data.set(el.stock, el.top_ask.price)
    });
    let stock_a_price: number = stock_data.get("AAPL")!;
    let stock_b_price: number = stock_data.get("GOOG")!;
    let stock_ratio: number = stock_a_price / stock_b_price;
    let upper_bound: number = stock_ratio + 0.5;
    let lower_bound: number = stock_ratio - 0.5;

    return serverResponds.map((el: any) => {
      return {
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        timestamp: el.timestamp,
        stock_ratio: stock_ratio,
        upper_bound: upper_bound,
        lower_bound: lower_bound,
      };
    })
  }
}
