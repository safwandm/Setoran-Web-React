import dotenv from 'dotenv';

import { Configuration } from './runtime';
import { AuthApi, MitraApi, MotorApi, NotifikasiApi, PelangganApi, PenggunaApi, SetoranAPINETApi } from './apis';
import { VoucherApi } from './apis';
// register api lain kalau butuh

// biar konfigurasi simple, kalau mau dev local buat .env
const BASE_PATH = process.env.BACKEND_HOST || "http://160.19.167.222:5104"

class ApiService {
  private static instance: ApiService;
  private config: Configuration

  public authApi!: AuthApi;
  public pelangganApi!: PelangganApi;
  public penggunaApi!: PenggunaApi;
  public mitraApi!: MitraApi;
  public motorApi!: MotorApi;
  public voucherApi!: VoucherApi;
  public setoranApi!: SetoranAPINETApi;
  public notifikasiApi!: NotifikasiApi;

  private constructor(config?: Configuration) {
    if (config == undefined)
        config = new Configuration({
        basePath: BASE_PATH,
        accessToken: () => localStorage.getItem("access_token") ?? ""
        });
        
    this.config = config

    this.createApis();
  }

  private createApis() {
    this.authApi = new AuthApi(this.config);
    this.pelangganApi = new PelangganApi(this.config);
    this.penggunaApi = new PenggunaApi(this.config);
    this.mitraApi = new MitraApi(this.config);
    this.motorApi = new MotorApi(this.config);
    this.voucherApi = new VoucherApi(this.config);
    this.setoranApi = new SetoranAPINETApi(this.config);
    this.notifikasiApi = new NotifikasiApi(this.config);
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}

export default ApiService;
