import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

class CrashReportingService {
  constructor() {
    this.init();
  }

  init() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      enableNative: true,
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      integrations: [
        new Sentry.ReactNativeTracing({
          tracingOrigins: ['localhost', 'yourdomain.com', /^\//],
        }),
      ],
      tracesSampleRate: 0.2,
      beforeSend: (event) => {
        // Remove sensitive data
        if (event.request?.data) {
          delete event.request.data.password;
          delete event.request.data.token;
        }
        return event;
      },
    });
  }

  setUser(user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  setTags(tags) {
    Sentry.setTags(tags);
  }

  setContext(key, context) {
    Sentry.setContext(key, context);
  }

  captureException(error, context = {}) {
    Sentry.captureException(error, {
      extra: context,
      tags: {
        platform: Platform.OS,
        version: DeviceInfo.getVersion(),
        ...context.tags,
      },
    });
  }

  captureMessage(message, level = 'info', context = {}) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  }

  addBreadcrumb(breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }

  startTransaction(name, op) {
    return Sentry.startTransaction({ name, op });
  }

  async configureScope(callback) {
    Sentry.configureScope(callback);
  }
}

export default new CrashReportingService();