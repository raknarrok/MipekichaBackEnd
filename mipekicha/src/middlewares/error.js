import  EErrors from '../services/errors/enums.js'

export default (error, req, res, next) => {

    console.log(error)

    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(404).send({
                status: 'error',
                error: error.name,
                cause: error.cause
            })
            break
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                cause: error.cause
            })
            break
        case EErrors.DATABASE_ERROR:
            res.status(500).send({
                status: 'error',
                error: error.name,
                cause: error.cause
            })
            break
        default:
            res.status(500).send({
                status: 'error',
                error: 'UnknownError 500',
            })
            break
    }
}