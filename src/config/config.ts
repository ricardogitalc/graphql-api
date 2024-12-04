export const CONFIG_MESSAGES = {
  tokenRefreshed: 'Acesso renovado com sucesso.',
  tokenInvalid: 'Token inválido ou expirado.',
  invalidCredentials: 'Credenciais inválidas.',

  // USER SUCCESS
  userCreated: 'Usuário criado.',
  userUpdated: 'Usuário atualizado.',
  userDeleted: 'Usuário deletado.',
  userVerified: 'Usuário verificado.',
  userLogged: 'Login realizado.',
  userLoggedOut: 'Logout realizado.',

  // USER ERROR
  userExists: 'Usuário já cadastrado.',
  userAllReady: 'Usuário já existe.',
  userNotFound: 'Usuário não encontrado.',
  userNotVerified: 'Email não verificado.',
  userNoPermission: 'Acesso negado.',

  // AUTH SUCCESS
  loginLinkSent: 'Link de acesso enviado.',
  verificationLinkSent: 'Link de verificação enviado.',
  tokenUpdated: 'Token atualizado.',

  // AUTH ERROR
  expiredToken: 'Token inválido ou expirado.',
  invalidToken: 'Token inválido.',
  invalidRefreshToken: 'Refresh token inválido.',
  accessLinkExpired: 'Link expirado.',
  unauthorized: 'Não autorizado.',
  adminOnly: 'Acesso apenas para admin.',

  // VALIDATION ERROR
  invalidData: 'Dados inválidos.',
  invalidEmail: 'Email inválido.',
  tooManyRequests: 'Muitas tentativas, aguarde um momento.',

  // INTEGRATION ERROR
  googleLoginError: 'Erro no login Google.',
} as const;

export const JWT_TIMES = {
  REGISTER_TOKEN: '30m',
  ACCESS_TOKEN: '30m',
  REFRESH_TOKEN: '1d',
} as const;
