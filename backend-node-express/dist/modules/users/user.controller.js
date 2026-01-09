"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const user_service_js_1 = require("./user.service.js");
const userService = new user_service_js_1.UserService();
const getMe = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user.id;
        const user = await userService.getMe(userId);
        return res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
//# sourceMappingURL=user.controller.js.map