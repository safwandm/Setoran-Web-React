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
import type { MetodePembayaran } from './MetodePembayaran';
import {
    MetodePembayaranFromJSON,
    MetodePembayaranFromJSONTyped,
    MetodePembayaranToJSON,
    MetodePembayaranToJSONTyped,
} from './MetodePembayaran';

/**
 * 
 * @export
 * @interface PostTransaksiDTO
 */
export interface PostTransaksiDTO {
    /**
     * 
     * @type {number}
     * @memberof PostTransaksiDTO
     */
    idMotor: number;
    /**
     * 
     * @type {number}
     * @memberof PostTransaksiDTO
     */
    idPelanggan: number;
    /**
     * 
     * @type {Date}
     * @memberof PostTransaksiDTO
     */
    tanggalMulai: Date;
    /**
     * 
     * @type {Date}
     * @memberof PostTransaksiDTO
     */
    tanggalSelesai: Date;
    /**
     * 
     * @type {MetodePembayaran}
     * @memberof PostTransaksiDTO
     */
    metodePembayaran: MetodePembayaran;
    /**
     * 
     * @type {number}
     * @memberof PostTransaksiDTO
     */
    idVoucher?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PostTransaksiDTO
     */
    idDiscount?: number | null;
}



/**
 * Check if a given object implements the PostTransaksiDTO interface.
 */
export function instanceOfPostTransaksiDTO(value: object): value is PostTransaksiDTO {
    if (!('idMotor' in value) || value['idMotor'] === undefined) return false;
    if (!('idPelanggan' in value) || value['idPelanggan'] === undefined) return false;
    if (!('tanggalMulai' in value) || value['tanggalMulai'] === undefined) return false;
    if (!('tanggalSelesai' in value) || value['tanggalSelesai'] === undefined) return false;
    if (!('metodePembayaran' in value) || value['metodePembayaran'] === undefined) return false;
    return true;
}

export function PostTransaksiDTOFromJSON(json: any): PostTransaksiDTO {
    return PostTransaksiDTOFromJSONTyped(json, false);
}

export function PostTransaksiDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): PostTransaksiDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'idMotor': json['idMotor'],
        'idPelanggan': json['idPelanggan'],
        'tanggalMulai': (new Date(json['tanggalMulai'])),
        'tanggalSelesai': (new Date(json['tanggalSelesai'])),
        'metodePembayaran': MetodePembayaranFromJSON(json['metodePembayaran']),
        'idVoucher': json['idVoucher'] == null ? undefined : json['idVoucher'],
        'idDiscount': json['idDiscount'] == null ? undefined : json['idDiscount'],
    };
}

export function PostTransaksiDTOToJSON(json: any): PostTransaksiDTO {
    return PostTransaksiDTOToJSONTyped(json, false);
}

export function PostTransaksiDTOToJSONTyped(value?: PostTransaksiDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'idMotor': value['idMotor'],
        'idPelanggan': value['idPelanggan'],
        'tanggalMulai': ((value['tanggalMulai']).toISOString()),
        'tanggalSelesai': ((value['tanggalSelesai']).toISOString()),
        'metodePembayaran': MetodePembayaranToJSON(value['metodePembayaran']),
        'idVoucher': value['idVoucher'],
        'idDiscount': value['idDiscount'],
    };
}

