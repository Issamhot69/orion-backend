"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const audio_service_1 = require("./audio.service");
const orchestrator_service_1 = require("../ai/orchestrator.service");
let AudioController = class AudioController {
    constructor(audioService, orchestrator) {
        this.audioService = audioService;
        this.orchestrator = orchestrator;
    }
    async transcribe(file, body) {
        const lang = body.lang || 'fr-FR';
        const text = await this.audioService.transcribe(file.buffer, file.mimetype, lang);
        const response = await this.orchestrator.processCommand(text, body.companyId || 'company-1', lang);
        return { transcription: text, ...response };
    }
};
exports.AudioController = AudioController;
__decorate([
    (0, common_1.Post)('transcribe'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "transcribe", null);
exports.AudioController = AudioController = __decorate([
    (0, common_1.Controller)('audio'),
    __metadata("design:paramtypes", [audio_service_1.AudioService,
        orchestrator_service_1.OrchestratorService])
], AudioController);
//# sourceMappingURL=audio.controller.js.map