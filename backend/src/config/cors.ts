import { WHITELIST_DOMAINS } from '@utils/constants'
import { env } from '@config/env'
import { StatusCodes } from 'http-status-codes'
import AppError from '@utils/AppError'
import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (env.NODE_ENV === 'dev') {
      return callback(null, true)
    }

    // Check if origin is an accepted domain or not
    if (WHITELIST_DOMAINS.includes(origin ?? '')) {
      return callback(null, true)
    }

    // If the domain is not accepted, an error is returned
    return callback(new AppError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  optionsSuccessStatus: 200,
  credentials: true
}