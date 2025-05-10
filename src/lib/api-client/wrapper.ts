import dotenv from 'dotenv';

import { Configuration } from './runtime';
import { MotorApi } from './apis';
import { VoucherApi } from './apis';
// register api lain kalau butuh

// biar konfigurasi simple, kalau mau dev local buat .env
const BASE_PATH = process.env.BACKEND_HOST || "http://160.19.167.222:5104/"

class ApiService {
  private static instance: ApiService;
  private config: Configuration

  public motorApi!: MotorApi;
  public voucherApi!: VoucherApi;

  private constructor(config?: Configuration) {
    if (config == undefined)
        config = new Configuration({
        basePath: BASE_PATH
        });
        
    this.config = config

    this.createApis();
  }

  private createApis() {
    this.motorApi = new MotorApi(this.config);
    this.voucherApi = new VoucherApi(this.config);
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setToken(token: string) {
    this.config = new Configuration({
      basePath: BASE_PATH,
      accessToken: token,
    });
    this.createApis(); // recreate APIs with new config
  }
}

export default ApiService;
