// keep-alive-task.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
@Injectable()
export class KeepAliveTaskService {
  private readonly MAX_RETRIES = 5;
  private retries = 0;

  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Cron('0 0-23/1 * * *')
  async sendKeepAliveMessage() {
    const chatId = '1013100688';
    const keepAliveMessage = 'Keep-Alive: Bot is active and running!';

    try {
      await this.sendMessageWithRetry(chatId, keepAliveMessage);
    } catch (error) {
      console.error('Failed to send keep-alive message:', error);
    }
  }

  private async sendMessageWithRetry(chatId: string, message: string) {
    try {
      await this.telegramBotService.sendMessageToUser(chatId, message);
    } catch (error) {
      if (this.retries < this.MAX_RETRIES) {
        const delay = 1000 * Math.pow(2, this.retries);
        this.retries++;
        console.error(
          `Failed to send message. Retrying in ${delay / 1000} seconds...`,
        );
        await this.sleep(delay);
        await this.sendMessageWithRetry(chatId, message);
      } else {
        console.error('Max retries reached. Skipping keep-alive message.');
      }
    } finally {
      // Reset retries counter after successful send
      this.retries = 0;
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
