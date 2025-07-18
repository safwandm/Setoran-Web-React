/* tslint:disable */
/* eslint-disable */
/**
 * MyAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { Pembayaran } from './Pembayaran';
import {
    PembayaranFromJSON,
    PembayaranFromJSONTyped,
    PembayaranToJSON,
    PembayaranToJSONTyped,
} from './Pembayaran';
import type { Motor } from './Motor';
import {
    MotorFromJSON,
    MotorFromJSONTyped,
    MotorToJSON,
    MotorToJSONTyped,
} from './Motor';
import type { StatusTransaksi } from './StatusTransaksi';
import {
    StatusTransaksiFromJSON,
    StatusTransaksiFromJSONTyped,
    StatusTransaksiToJSON,
    StatusTransaksiToJSONTyped,
} from './StatusTransaksi';
import type { Pelanggan } from './Pelanggan';
import {
    PelangganFromJSON,
    PelangganFromJSONTyped,
    PelangganToJSON,
    PelangganToJSONTyped,
} from './Pelanggan';

/**
 * 
 * @export
 * @interface Transaksi
 */
export interface Transaksi {
    /**
     * 
     * @type {number}
     * @memberof Transaksi
     */
    idTransaksi?: number;
    /**
     * 
     * @type {number}
     * @memberof Transaksi
     */
    idMotor?: number;
    /**
     * 
     * @type {number}
     * @memberof Transaksi
     */
    idPelanggan?: number;
    /**
     * 
     * @type {Date}
     * @memberof Transaksi
     */
    tanggalMulai?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Transaksi
     */
    tanggalSelesai?: Date;
    /**
     * 
     * @type {number}
     * @memberof Transaksi
     */
    totalHarga?: number;
    /**
     * 
     * @type {StatusTransaksi}
     * @memberof Transaksi
     */
    status?: StatusTransaksi;
    /**
     * 
     * @type {Motor}
     * @memberof Transaksi
     */
    motor?: Motor;
    /**
     * 
     * @type {Pelanggan}
     * @memberof Transaksi
     */
    pelanggan?: Pelanggan;
    /**
     * 
     * @type {Pembayaran}
     * @memberof Transaksi
     */
    pembayaran?: Pembayaran;
}



/**
 * Check if a given object implements the Transaksi interface.
 */
export function instanceOfTransaksi(value: object): value is Transaksi {
    return true;
}

export function TransaksiFromJSON(json: any): Transaksi {
    return TransaksiFromJSONTyped(json, false);
}

export function TransaksiFromJSONTyped(json: any, ignoreDiscriminator: boolean): Transaksi {
    if (json == null) {
        return json;
    }
    return {
        
        'idTransaksi': json['idTransaksi'] == null ? undefined : json['idTransaksi'],
        'idMotor': json['idMotor'] == null ? undefined : json['idMotor'],
        'idPelanggan': json['idPelanggan'] == null ? undefined : json['idPelanggan'],
        'tanggalMulai': json['tanggalMulai'] == null ? undefined : (new Date(json['tanggalMulai'])),
        'tanggalSelesai': json['tanggalSelesai'] == null ? undefined : (new Date(json['tanggalSelesai'])),
        'totalHarga': json['totalHarga'] == null ? undefined : json['totalHarga'],
        'status': json['status'] == null ? undefined : StatusTransaksiFromJSON(json['status']),
        'motor': json['motor'] == null ? undefined : MotorFromJSON(json['motor']),
        'pelanggan': json['pelanggan'] == null ? undefined : PelangganFromJSON(json['pelanggan']),
        'pembayaran': json['pembayaran'] == null ? undefined : PembayaranFromJSON(json['pembayaran']),
    };
}

export function TransaksiToJSON(json: any): Transaksi {
    return TransaksiToJSONTyped(json, false);
}

export function TransaksiToJSONTyped(value?: Transaksi | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'idTransaksi': value['idTransaksi'],
        'idMotor': value['idMotor'],
        'idPelanggan': value['idPelanggan'],
        'tanggalMulai': value['tanggalMulai'] == null ? undefined : ((value['tanggalMulai']).toISOString()),
        'tanggalSelesai': value['tanggalSelesai'] == null ? undefined : ((value['tanggalSelesai']).toISOString()),
        'totalHarga': value['totalHarga'],
        'status': StatusTransaksiToJSON(value['status']),
        'motor': MotorToJSON(value['motor']),
        'pelanggan': PelangganToJSON(value['pelanggan']),
        'pembayaran': PembayaranToJSON(value['pembayaran']),
    };
}

