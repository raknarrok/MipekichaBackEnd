import { logger } from '../../middlewares/logger.js'
export const getLogs = async (req, res, next) => {
    try {
        const result = 'Terminal Information is displayed'

        logger.debug('Debug Level Message')
        logger.http('Http Level Message')
        logger.info('Info Level Message')
        logger.warning('Warnin gLevel Message')
        logger.error('Error Level Message')
        logger.fatal('Fatal Level Message')

        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        next(error)
    }
}