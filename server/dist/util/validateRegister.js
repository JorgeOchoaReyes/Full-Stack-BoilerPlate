"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (options.username.length <= 2) {
        return [{
                field: 'username',
                message: 'Username too short, must be greater than 2 letters.'
            }];
    }
    if (!options.email.includes('@')) {
        return [{
                field: 'email',
                message: 'Invalid Email Must Include @ sign.'
            }];
    }
    if (options.username.includes('@')) {
        return [{
                field: 'username',
                message: 'Can not include @.'
            }];
    }
    if (options.password.length <= 2) {
        return [{
                field: 'Password',
                message: 'Password too short, must be greater than 2 letters.'
            }];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map