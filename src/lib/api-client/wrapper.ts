import dotenv from 'dotenv';
dotenv.config()

import { Configuration } from './runtime';
import { AuthApi, DiskonApi, MitraApi, MotorApi, MotorImageApi, NotifikasiApi, PelangganApi, PenggunaApi, SetoranAPINETApi, StorageApi, TransaksiApi } from './apis';
import { VoucherApi } from './apis';
// register api lain kalau butuh

// biar konfigurasi simple, kalau mau dev local buat .env
export const BASE_PATH = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://160.19.167.222:5104"

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
  public transaksiApi!: TransaksiApi;
  public diskonApi!: DiskonApi;
  public storageApi!: StorageApi;
  public motorImageApi!: MotorImageApi;

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
    this.transaksiApi = new TransaksiApi(this.config);
    this.diskonApi = new DiskonApi(this.config);
    this.storageApi = new StorageApi(this.config);
    this.motorImageApi = new MotorImageApi(this.config);
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}

export default ApiService;
