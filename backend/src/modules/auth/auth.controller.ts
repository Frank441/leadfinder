import type { IController } from "@/types/api";
import type { AuthService } from "./auth.service";
import type { RequestHandler } from "express";


export class AuthController implements IController {
    constructor(
        private readonly service: AuthService
    ) {}

    findById: RequestHandler = async (req, res) => {
        return;
    };

    findAll: RequestHandler = async (req, res) => {
        return;
    };

    create: RequestHandler = async (req, res) => {
        return;
    };

    update: RequestHandler = async (req, res) => {
        return;
    };

    patch: RequestHandler = async (req, res) => {
        return;
    };

    remove: RequestHandler = async (req, res) => {
        return;
    };
}