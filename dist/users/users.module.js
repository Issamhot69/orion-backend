"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const audio_service_1 = require("./audio.service");
const audio_controller_1 = require("./audio.controller");
const orchestrator_service_1 = require("../ai/orchestrator.service");
const document_agent_1 = require("../agents/document.agent");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [audio_controller_1.AudioController],
        providers: [audio_service_1.AudioService, orchestrator_service_1.OrchestratorService, document_agent_1.DocumentAgent],
        exports: [audio_service_1.AudioService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map