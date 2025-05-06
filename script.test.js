const { signup, login } = require('./script');
describe('Login Function', () => {
    it('should successfully log in with valid credentials', () => {
        
        const mockLoginApi = jest.fn().mockResolvedValue({ success: true, message: 'Login successful' });

        const originalFetch = global.fetch;
        global.fetch = mockLoginApi;

        return login('example@gmail.com', 'password123').then(response => {
            expect(response.success).toBe(true);
            expect(response.message).toBe('Login successful');
            expect(mockLoginApi).toHaveBeenCalledWith(expect.stringContaining('/login'), expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining(JSON.stringify({ email: 'example@gmail.com', password: 'password123' })),
            }));
        }).finally(() => {
            global.fetch = originalFetch;
        });
    });

    it('should fail to log in with invalid credentials', () => {
        const mockLoginApi = jest.fn().mockResolvedValue({ success: false, message: 'Invalid credentials' });

        const originalFetch = global.fetch;
        global.fetch = mockLoginApi;

        return login('wrong@gmail.com', 'wrongpassword').then(response => {
            expect(response.success).toBe(false);
            expect(response.message).toBe('Invalid credentials');
        }).finally(() => {
            global.fetch = originalFetch;
        });
    });

    it('should handle network errors during login', () => {
        const mockLoginApi = jest.fn().mockRejectedValue(new Error('Network error'));

        const originalFetch = global.fetch;
        global.fetch = mockLoginApi;

        return login('testuser', 'password123').catch(error => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Network error');
        }).finally(() => {
            global.fetch = originalFetch;
        });
    });
});

describe('Signup Function', () => {
    it('should successfully sign up a new user', () => {
        const mockSignupApi = jest.fn().mockResolvedValue({ success: true, message: 'Signup successful' });

        const originalFetch = global.fetch;
        global.fetch = mockSignupApi;

        return signup('newuser@example.com', 'newpassword' ).then(response => {
            expect(response.success).toBe(true);
            expect(response.message).toBe('Signup successful');
        }).finally(() => {
            global.fetch = originalFetch;
        });
    });

    it('should fail to sign up if the user already exists', () => {
        const mockSignupApi = jest.fn().mockResolvedValue({ success: false, message: 'User already exists' });

        const originalFetch = global.fetch;
        global.fetch = mockSignupApi;

        return signup('existinguser@example.com' ,'newpassword' ).then(response => {
            expect(response.success).toBe(false);
            expect(response.message).toBe('User already exists');
        }).finally(() => {
            global.fetch = originalFetch;
        });
    });

    it('should handle network errors during signup', () => {
        const mockSignupApi = jest.fn().mockRejectedValue(new Error('Network error'));

        const originalFetch = global.fetch;
        global.fetch = mockSignupApi;

        return signup('newuser', 'newpassword', 'newuser@example.com').catch(error => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Network error');
        }).finally(() => {
            global.fetch = originalFetch;
        });
    });
});