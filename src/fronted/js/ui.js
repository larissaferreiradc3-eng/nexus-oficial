// ======================================================
// GESTÃO DE USUÁRIOS SIMPLIFICADA (USANDO localStorage)
// ======================================================

function registrarUsuario(user, pass) {
    const loginMessage = document.getElementById('login-message');
    loginMessage.style.color = '#cf6679'; // Reset para cor de erro

    if (!user || !pass) {
        loginMessage.textContent = 'Preencha o usuário e a senha para se registrar.';
        return;
    }

    // O usuário "admin" é reservado
    if (user.toLowerCase() === 'admin') {
        loginMessage.textContent = 'Usuário "admin" reservado. Escolha outro.';
        return;
    }

    // Armazenamento simplificado: O username é a chave
    if (localStorage.getItem(user)) {
        loginMessage.textContent = `Erro: O usuário "${user}" já está registrado.`;
        return;
    }

    // Salva o usuário e senha (simplesmente como texto, sem hash)
    localStorage.setItem(user, pass);
    loginMessage.textContent = `Sucesso! O usuário "${user}" foi registrado. Faça o login.`;
    loginMessage.style.color = '#03dac6'; // Cor ciano para sucesso
}

function fazerLogin(user, pass) {
    const loginMessage = document.getElementById('login-message');
    loginMessage.style.color = '#cf6679'; // Cor padrão (vermelha) para erro

    if (!user || !pass) {
        loginMessage.textContent = 'Preencha o usuário e a senha.';
        return;
    }

    // Verifica se o usuário existe no localStorage E se a senha confere
    if (localStorage.getItem(user) === pass) {
        iniciarSessao(user);
    } else {
        loginMessage.textContent = 'Usuário ou senha inválidos. Tente novamente.';
    }
}

// ======================================================
// EVENT LISTENERS DE LOGIN E REGISTRO
// (Inclua esta parte onde você tem outros listeners no final do ui.js)
// ======================================================

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fazerLogin(username, password); 
});

// Novo Event Listener para o botão de Registro
document.getElementById('register-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    registrarUsuario(username, password);
});

// Inclua aqui também o seu listener do botão de Logout, se ele já existir.
// Exemplo:
// document.getElementById('logout-btn').addEventListener('click', encerrarSessao);
