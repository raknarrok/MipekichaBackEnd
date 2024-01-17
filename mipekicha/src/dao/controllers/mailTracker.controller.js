import { mailTrackerService } from '../../services/index.js'

export const addMailTracker = async (req, res) => {

    const result = await  mailTrackerService.addMailTracker(req.body)

}

export const verifyToken = async (req, res) => {
    // TODO: Implement Try/Catch
}