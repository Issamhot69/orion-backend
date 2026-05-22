import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AudioService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async transcribe(buffer: Buffer, mimetype: string, lang: string = 'fr'): Promise<string> {
    const ext = 'webm';
    const tmpPath = path.join('/tmp', `orion_audio_${Date.now()}.${ext}`);
    fs.writeFileSync(tmpPath, buffer);

    try {
      const transcription = await this.groq.audio.transcriptions.create({
        file: fs.createReadStream(tmpPath),
        model: 'whisper-large-v3',
        language: lang.split('-')[0],
        response_format: 'json',
      });
      fs.unlinkSync(tmpPath);
      return transcription.text;
    } catch (e) {
      fs.unlinkSync(tmpPath);
      throw e;
    }
  }
}
