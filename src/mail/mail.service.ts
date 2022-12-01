import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18n, I18nService } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  constructor(
    @I18n()
    private i18n: I18nService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async userSignUp(mailData) {
    const email = {
      to: mailData.to,
      subject: 'Su reserva se hizo correctamente',
      text: `La hora de su reserva es para las ${mailData.appointment.dateHour}:00 del dia ${mailData.appointment.dateAppointment}
      Se les comunicara cualquier notificacion por whatsapp y por correo, por ahi enviaremos el link del zoom para la reunion`,
      template: 'activation',
      context: {
        title: 'Psicomas',
        url: `${this.configService.get('app.frontendDomain')}`,
        actionTitle: 'Ver pagina principal',
        app_name: 'Psicomas',
        text1: `La hora de su reserva es para las ${mailData.appointment.dateHour}:00 del dia ${mailData.appointment.dateAppointment}
        Se les comunicara cualquier notificacion por whatsapp y por correo, por ahi enviaremos el link del zoom para la reunion`,
        text2: '',
        text3: '',
      },
    };
    console.log(email);
    await this.mailerService.sendMail(email);
  }

  async forgotPassword(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('common.resetPassword'),
      text: `${this.configService.get('app.frontendDomain')}/password-change/${
        mailData.data.hash
      } ${await this.i18n.t('common.resetPassword')}`,
      template: 'reset-password',
      context: {
        title: await this.i18n.t('common.resetPassword'),
        url: `${this.configService.get('app.frontendDomain')}/password-change/${
          mailData.data.hash
        }`,
        actionTitle: await this.i18n.t('common.resetPassword'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('reset-password.text1'),
        text2: await this.i18n.t('reset-password.text2'),
        text3: await this.i18n.t('reset-password.text3'),
        text4: await this.i18n.t('reset-password.text4'),
      },
    });
  }
}
