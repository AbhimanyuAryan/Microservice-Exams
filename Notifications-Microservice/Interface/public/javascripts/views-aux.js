// Imagens
function addUploadImagemInput() {
    var uploadContainer = $('<div>').addClass('upload-container');
    var previewImage = $('<img>').addClass('preview');
    var removeButton = $('<button class="w3-button w3-border w3-light-grey w3-ripple">').addClass('remove-button').attr('type', 'button').text('Remover');

    var imagemInput = $('<input>').attr({
        type: 'file',
        name: 'imagens',
        accept: 'image/*',
        style: 'margin-top: 16px;'
    });

    var legendaInput = $('<input>').attr({
        type: 'text',
        name: 'legendas[]',
        placeholder: 'Introduza a legenda da imagem...',
        style: 'margin-bottom: 32px; display: none;'
    });

    uploadContainer.append(imagemInput);
    uploadContainer.append(removeButton);

    $('#imagensContainer').append(uploadContainer);
    $('#imagensContainer').append(previewImage);
    $('#imagensContainer').append(legendaInput);

    removeButton.on('click', function () {
        uploadContainer.remove();
        previewImage.remove();
        legendaInput.remove();
    });

    imagemInput.on('change', function (event) {
        if ($(this).val() !== '') {
            var file = event.target.files[0];
            var reader = new FileReader();

            legendaInput.show();
            previewImage.show();

            reader.onload = function (e) {
                previewImage.attr('src', e.target.result);
            };

            reader.readAsDataURL(file);
        }
        else {
            legendaInput.hide();
            legendaInput.val('');
            previewImage.hide();
        }
    });

    $('form').on('submit', function () {
        if (legendaInput.is(':hidden')) {
            legendaInput.detach();
        }
    });

};

function addSavedImagemPreview(containerName, imagem, legenda) {
    var uploadContainer = $('<div>').addClass('upload-container');
    var previewImage = $('<img>').attr({
        class: 'preview',
        src: '/images/api/' + imagem,
        style: 'margin-top: 16px;'
    })

    var legenda_imagem = $('<figcaption>').text(legenda);

    $(containerName).append(uploadContainer);
    $(containerName).append(previewImage);
    $(containerName).append(legenda_imagem);
};

function addSavedImagemInput(_id, imagem, legenda, index) {
    var uploadContainer = $('<div>').addClass('upload-container');
    var previewImage = $('<img>').attr({
        class: 'preview',
        src: '/images/api/' + imagem,
        style: 'margin-top: 16px;'
    })

    var _idInput = $('<input>').attr({
        type: 'text',
        name: 'imagens_editadas_removidas[' + index + '][_id]',
        style: 'display: none;',
        value: _id
    });

    var imagemPathInput = $('<input>').attr({
        type: 'text',
        name: 'imagens_editadas_removidas[' + index + '][imagem]',
        style: 'display: none;',
        value: imagem
    });

    var legendaInput = $('<input>').attr({
        type: 'text',
        name: 'imagens_editadas_removidas[' + index + '][legenda]',
        placeholder: 'Introduza a legenda da imagem...',
        value: legenda
    });

    var removePhotoOption = $('<label>').append($('<input>').attr({
        type: 'checkbox',
        style: 'margin-right: 0.5%; margin-bottom: 32px'
    }));

    removePhotoOption.append('Remover fotografia');

    $('#imagensContainer').append(uploadContainer);
    $('#imagensContainer').append(previewImage);
    $('#imagensContainer').append(_idInput);
    $('#imagensContainer').append(imagemPathInput);
    $('#imagensContainer').append(legendaInput);
    $('#imagensContainer').append(removePhotoOption);

    $('form').on('submit', function () {
        if (legendaInput.is(':hidden')) {
            legendaInput.detach();
        }

        if (removePhotoOption.find('input').is(':checked')) {
            var checkedPhotoOption = $('<input>').attr({
                type: 'checkbox',
                name: 'imagens_editadas_removidas[' + index + '][manter]',
                style: 'display: none;',
                value: false,
                checked: true
            });

            $('#imagensContainer').append(checkedPhotoOption);
        }
        else {
            var uncheckedPhotoOption = $('<input>').attr({
                type: 'checkbox',
                name: 'imagens_editadas_removidas[' + index + '][manter]',
                style: 'display: none;',
                value: true,
                checked: true
            });

            $('#imagensContainer').append(uncheckedPhotoOption);
        }
    });
};

function addFotoPerfilInput() {
    var uploadContainer = $('<div>').addClass('upload-container');

    var default_photo = '/images/avatar.png';
    var previewImage = $('<img>').attr({
        src: default_photo,
        style: 'width: 10%; margin-top: 16px;',
        class: 'w3-circle'
    })

    var removeButton = $('<button class="w3-button w3-border w3-light-grey w3-ripple">').addClass('remove-button').attr('type', 'button').text('Remover');
    var imagemInput = $('<input>').attr({
        type: 'file',
        name: 'foto_perfil',
        accept: 'image/*',
        style: 'margin-top: 16px;'
    });

    uploadContainer.append(imagemInput);
    uploadContainer.append(removeButton);

    $('#fotoPerfilContainer').append(previewImage);
    $('#fotoPerfilContainer').append(uploadContainer);

    removeButton.on('click', function () {
        imagemInput.val('');
        previewImage.attr('src', default_photo);
    });

    imagemInput.on('change', function (event) {
        if ($(this).val() !== '') {
            var file = event.target.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                previewImage.attr('src', e.target.result);
            };

            reader.readAsDataURL(file);
        }
        else {
            previewImage.attr('src', default_photo);
        }
    });
};

function addChangeFotoPerfilInput(foto_perfil_atual) {
    var uploadContainer = $('<div>').addClass('upload-container');

    if (foto_perfil_atual === null) {
        foto_perfil_atual = '/images/avatar.png'
    }

    var previewImage = $('<img>').attr({
        src: foto_perfil_atual,
        style: 'width: 200px; margin-top: 16px;',
        class: 'w3-circle w3-margin-right'
    })

    var removeButton = $('<button class="w3-button w3-border w3-light-grey w3-ripple">').addClass('remove-button').attr('type', 'button').text('Remover');
    var imagemInput = $('<input>').attr({
        type: 'file',
        name: 'foto_perfil',
        accept: 'image/*',
        style: 'margin-top: 16px;',
        id: 'fotoPerfilInput'
    });

    uploadContainer.append(imagemInput);
    uploadContainer.append(removeButton);

    $('#fotoPerfilContainer').append(previewImage);
    $('#fotoPerfilContainer').append(uploadContainer);

    removeButton.on('click', function () {
        imagemInput.val('');
        previewImage.attr('src', foto_perfil_atual);
    });

    imagemInput.on('change', function (event) {
        if ($(this).val() !== '') {
            var file = event.target.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                previewImage.attr('src', e.target.result);
            };

            reader.readAsDataURL(file);
        }
        else {
            previewImage.attr('src', foto_perfil_atual);
        }
    });
};

// Entidades
function addEmptyEntidadeInput(index) {
    var newRow = $('<tr>');
    var nomeCell = $('<td>').html(`<input type="text" class="nomeInput w3-input w3-round" name="entidades[${index}][nome]">`);

    var tipoSelect = $('<select>').attr({
        class: 'tipoInput w3-input w3-round',
        name: 'entidades[' + index + '][tipo]'
    }).append(
        $('<option>').attr('value', '').text(''),
        $('<option>').attr('value', 'instituição').text('Instituição'),
        $('<option>').attr('value', 'pessoa').text('Pessoa'),
        $('<option>').attr('value', 'empresa').text('Empresa'),
        $('<option>').attr('value', 'família').text('Família')
    );

    var tipoCell = $('<td>').append(tipoSelect);

    var removeButton = $('<button class="w3-button w3-border w3-light-grey w3-ripple">').text('Remover').click(function () {
        $(this).closest('tr').remove();
        if ($('#entidadesTable tr').length - 1 <= 0) {
            $('#entidadesTable').hide();
        }
    });
    var acoesCell = $('<td>').append(removeButton);

    newRow.append(nomeCell, tipoCell, acoesCell);
    $('#entidadesTable').append(newRow);

    if ($('#entidadesTable tr').length - 1 > 0) {
        $('#entidadesTable').show();
    }
}


function addReadOnlyFilledEntidadeInput(containerName, nome, tipo, index) {
    var newRow = $('<tr>');
    var nomeCell = $('<td>').html(`<input type="text" value="${nome}" class="nomeInput w3-input w3-round" name="entidades[${index}][nome]" readonly>`);

    var tipoSelect = $('<select disabled>').attr({
        class: 'tipoInput w3-input w3-round',
        name: 'entidades[' + index + '][tipo]',
        style: 'color: black'
    }).append(
        $('<option>').attr('value', '').text(''),
        $('<option>').attr('value', 'instituição').text('Instituição'),
        $('<option>').attr('value', 'pessoa').text('Pessoa'),
        $('<option>').attr('value', 'empresa').text('Empresa'),
        $('<option>').attr('value', 'família').text('Família')
    );

    tipoSelect.find(`option[value="${tipo}"]`).prop('selected', true);

    var tipoCell = $('<td>').append(tipoSelect);

    newRow.append(nomeCell, tipoCell);
    $(containerName).append(newRow);

    if ($('#entidadesTable tr').length - 1 > 0) {
        $(containerName).show();
    }
}


function addFilledEntidadeInput(nome, tipo, index) {
    var newRow = $('<tr>');
    var nomeCell = $('<td>').html(`<input type="text" value="${nome}" class="nomeInput w3-input w3-round" name="entidades[${index}][nome]">`);

    var tipoSelect = $('<select>').attr({
        class: 'tipoInput w3-input w3-round',
        name: 'entidades[' + index + '][tipo]'
    }).append(
        $('<option>').attr('value', '').text(''),
        $('<option>').attr('value', 'instituição').text('Instituição'),
        $('<option>').attr('value', 'pessoa').text('Pessoa'),
        $('<option>').attr('value', 'empresa').text('Empresa'),
        $('<option>').attr('value', 'família').text('Família')
    );

    tipoSelect.find(`option[value="${tipo}"]`).prop('selected', true);

    var tipoCell = $('<td>').append(tipoSelect);

    var removeButton = $('<button class="w3-button w3-border w3-light-grey w3-ripple">').text('Remover').click(function () {
        $(this).closest('tr').remove();
        if ($('#entidadesTable tr').length - 1 <= 0) {
            $('#entidadesTable').hide();
        }
    });
    var acoesCell = $('<td>').append(removeButton);

    newRow.append(nomeCell, tipoCell, acoesCell);
    $('#entidadesTable').append(newRow);

    if ($('#entidadesTable tr').length - 1 > 0) {
        $('#entidadesTable').show();
    }
}

// Casas
function addEmptyCasaInput(index) {
    var newRow = $('<tr>');
    var numeroCell = $('<td>').html(`<input type="text" class="nomeInput w3-input w3-round" name="casas[${index}][numero]">`);
    var vistaCell = $('<td>').html(`<input type="text" class="nomeInput w3-input w3-round" name="casas[${index}][vista]">`);
    var enfiteutaCell = $('<td>').html(`<input type="text" class="nomeInput w3-input w3-round" name="casas[${index}][enfiteuta]">`);
    var foroCell = $('<td>').html(`<input type="text" class="nomeInput w3-input w3-round" name="casas[${index}][foro]">`);
    var descricaoCell = $('<td>').html(`<input type="text" class="nomeInput w3-input w3-round" name="casas[${index}][desc]">`);
    var removeButton = $('<button class="w3-button w3-border w3-light-grey w3-ripple">').text('Remover').click(function () {
        $(this).closest('tr').remove();
        if ($('#casasTable tr').length - 1 <= 0) {
            $('#casasTable').hide();
        }
    });
    var acoesCell = $('<td>').append(removeButton);

    newRow.append(numeroCell, vistaCell, enfiteutaCell, foroCell, descricaoCell, acoesCell);
    $('#casasTable').append(newRow);

    if ($('#casasTable tr').length - 1 > 0) {
        $('#casasTable').show();
    }
};

function addFilledReadOnlyCasaInput(containerName, numero, vista, enfiteuta, foro, descricao, index) {
    var newRow = $('<tr>');
    var numeroCell = $('<td>').html(`<input type="text" value="${numero}" class="nomeInput w3-input w3-round" name="casas[${index}][numero]" readonly>`);
    var vistaCell = $('<td>').html(`<input type="text" value="${vista}" class="nomeInput w3-input w3-round" name="casas[${index}][vista]" readonly>`);
    var enfiteutaCell = $('<td>').html(`<input type="text" value="${enfiteuta}" class="nomeInput w3-input w3-round" name="casas[${index}][enfiteuta]" readonly>`);
    var foroCell = $('<td>').html(`<input type="text" value="${foro}" class="nomeInput w3-input w3-round" name="casas[${index}][foro]" readonly>`);
    var descricaoCell = $('<td>').html(`<input type="text" value="${descricao}" class="nomeInput w3-input w3-round" name="casas[${index}][desc]" readonly>`);

    newRow.append(numeroCell, vistaCell, enfiteutaCell, foroCell, descricaoCell);
    $(containerName).append(newRow);

    if ($('#casasTable tr').length - 1 > 0) {
        $(containerName).show();
    }
};

function addFilledCasaInput(numero, vista, enfiteuta, foro, descricao, index) {
    var newRow = $('<tr>');
    var numeroCell = $('<td>').html(`<input type="text" value="${numero}" class="nomeInput w3-input w3-round" name="casas[${index}][numero]">`);
    var vistaCell = $('<td>').html(`<input type="text" value="${vista}" class="nomeInput w3-input w3-round" name="casas[${index}][vista]">`);
    var enfiteutaCell = $('<td>').html(`<input type="text" value="${enfiteuta}" class="nomeInput w3-input w3-round" name="casas[${index}][enfiteuta]">`);
    var foroCell = $('<td>').html(`<input type="text" value="${foro}" class="nomeInput w3-input w3-round" name="casas[${index}][foro]">`);
    var descricaoCell = $('<td>').html(`<input type="text" value="${descricao}" class="nomeInput w3-input w3-round" name="casas[${index}][desc]">`);
    var removeButton = $('<button class="w3-button w3-border w3-light-grey w3-ripple">').text('Remover').click(function () {
        $(this).closest('tr').remove();
        if ($('#casasTable tr').length - 1 <= 0) {
            $('#casasTable').hide();
        }
    });
    var acoesCell = $('<td>').append(removeButton);

    newRow.append(numeroCell, vistaCell, enfiteutaCell, foroCell, descricaoCell, acoesCell);
    $('#casasTable').append(newRow);

    if ($('#casasTable tr').length - 1 > 0) {
        $('#casasTable').show();
    }
};

// Datas
function addReadOnlyDataTagToList(containerName, text) {
    var tagElement = $('<li>', {
        text: text,
        class: 'tag'
    });

    tagElement.appendTo(containerName);
}

function addDataTagToList(text) {
    var tagElement = $('<li>', {
        text: text,
        class: 'tag'
    });

    var removeButton = $('<button>', {
        html: '&#10006;',
        class: 'remove-button-tag',
        style: 'font-size: 12px; padding: 2px;'
    });

    tagElement.append(removeButton);
    tagElement.appendTo('#datasList');
}

function getDatasInput() {
    var index = 0;

    $('#datasList').find('li.tag').each(function () {
        var text = $(this)
            .contents()
            .filter(function () {
                return this.nodeType === Node.TEXT_NODE;
            })
            .text()
            .trim();

        var inputElement = $('<input>', {
            type: 'hidden',
            name: 'datas[' + index + '][nome]',
            value: text
        });

        $('#datasInput').append(inputElement);
        index++;
    });
}

function addReadOnlyLugarTagToList(containerName, text) {
    var tagElement = $('<li>', {
        text: text,
        class: 'tag'
    });

    tagElement.appendTo(containerName);
}

function addLugarTagToList(text) {
    var tagElement = $('<li>', {
        text: text,
        class: 'tag'
    });

    var removeButton = $('<button>', {
        html: '&#10006;',
        class: 'remove-button-tag',
        style: 'font-size: 12px; padding: 2px;'
    });

    tagElement.append(removeButton);
    tagElement.appendTo('#lugaresList');
}

function getLugaresInput() {
    var index = 0;

    $('#lugaresList').find('li.tag').each(function () {
        var text = $(this)
            .contents()
            .filter(function () {
                return this.nodeType === Node.TEXT_NODE;
            })
            .text()
            .trim();

        var inputElement = $('<input>', {
            type: 'hidden',
            name: 'lugares[' + index + '][nome]',
            value: text
        });

        $('#lugaresInput').append(inputElement);
        index++;
    });
}

function toggleSidebar() {
    var mainContent = document.getElementById("main-content");
    var sidebar = document.getElementById("mySidebar");
    var favIcon = document.getElementById("favIconBar");

    if (sidebar.style.display === "none") {
        sidebar.style.display = "block";
        mainContent.style.marginLeft = "340px";
        favIcon.style.marginLeft = "240px";
    } else {
        sidebar.style.display = "none";
        mainContent.style.marginLeft = "40px";
        favIcon.style.marginLeft = "5px";
    }
}

function handleSearchBox(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
};

function handleSearch() {
    const searchBox = document.getElementById("searchBox").value;
    const selectedOption = "search"

    if (searchBox !== "") {
        const searchParams = new URLSearchParams();
        searchParams.set(selectedOption, searchBox);

        const currentUrl = new URL(window.location.href);
        currentUrl.search = searchParams.toString();

        window.location.href = currentUrl.href;
    }

}




function clickToggle() {
    const passwordInput = document.getElementById('password');
    const buttonShowHide = document.getElementById('mostrarIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        buttonShowHide.nextSibling.textContent = '  Ocultar';
    } else {
        passwordInput.type = 'password';
        buttonShowHide.nextSibling.textContent = '  Mostrar';
    }
}

// w3 functions

// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    document.querySelector("div.sticky").style.display = "none";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
}

function onClose(element) {
    document.getElementById("modal01").style.display = "none";
    document.querySelector("div.sticky").style.display = "block";
}

// function to read 'tabs' in textarea input
function insertTab(event) {
    if (event.key === 'Tab') {
        event.preventDefault();

        var textarea = event.target;
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;

        textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
}


$(document).ready(function () {
    var index_adicionarEntidade = 0;
    var index_adicionarCasa = 0;

    // Imagens
    $('#adicionarImagem').on('click', function () {
        addUploadImagemInput();
    });

    // Entidades
    $('#adicionarEntidade').on('click', function () {
        addEmptyEntidadeInput(index_adicionarEntidade);
        index_adicionarEntidade++;
    });

    //Casas
    $('#adicionarCasa').on('click', function () {
        addEmptyCasaInput(index_adicionarCasa);
        index_adicionarCasa++;
    });

    // Datas
    $('#datasInput').keyup(function (event) {
        if (event.key === ';' || event.code === 'Semicolon') {
            var text = $(this).val();
            text = text.substring(0, text.length - 1).trim();

            if (text !== '') {
                addDataTagToList(text);
                $(this).val('');
            }
        }
    });

    $('#datasList').on('click', '.remove-button-tag', function () {
        var text = $(this).parent().text();
        $(this).parent().remove();
    });

    $('form').on('submit', function () {
        getDatasInput();
    });

    // Lugares
    $('#lugaresInput').keyup(function (event) {
        if (event.key === ';' || event.code === 'Semicolon') {
            var text = $(this).val()
            text = text.substring(0, text.length - 1).trim();

            if (text !== '') {
                addLugarTagToList(text);
                $(this).val('');
            }
        }
    });

    $('#lugaresList').on('click', '.remove-button-tag', function () {
        var text = $(this).parent().text();
        $(this).parent().remove();

    });

    $('form').on('submit', function () {
        getLugaresInput();
    });

    $('#alterarPassword').on('click', function () {
        $('#passwordContainer').show();
        $('#alterarPassword').hide();
        $('#manterPassword').show();
    });

    $('#manterPassword').on('click', function () {
        $('#passwordContainer').hide();
        $('#manterPassword').hide();
        $('#alterarPassword').show();
    });

    $('#submitEditUser').on('click', function () {
        if ($('#passwordContainer').is(':hidden')) {
            $('#passwordContainer').detach();
        }
    });

    $('#editUserForm').submit(function () {
        var fotoPerfilInputCopy = $('#fotoPerfilInput').clone();
        fotoPerfilInputCopy.attr('id', 'fotoPerfilInputCopy');
        fotoPerfilInputCopy.attr('style', 'display: none');

        fotoPerfilInputCopy.appendTo('#editUserForm')

    });

});

function confirmRuaDelete(url) {
    var confirmed = confirm('Tem a certeza que pretende remover esta rua?');
    if (confirmed) {
        window.location.href = url;
    }
}

function confirmPostDelete(url, event) {
    var confirmed = confirm('Tem a certeza que pretende remover esta publicação?');
    if (confirmed) {
        window.location.href = url;
    }
    event.stopPropagation();
}

function confirmCommentDelete(url, event) {
    var confirmed = confirm('Tem a certeza que pretende remover este comentário?');
    if (confirmed) {
        window.location.href = url;
    }
    event.stopPropagation();
}

function confirmUserDelete(url) {
    var confirmed = confirm('Tem a certeza que pretende eliminar a sua conta de utilizador?');
    if (confirmed) {
        window.location.href = url;
    }
}

function isInternalUrl(url) {
    var internalRegex = new RegExp('^' + window.location.origin, 'i');
    return internalRegex.test(url);
}

window.addEventListener('DOMContentLoaded', function () {
    var btnVoltar = document.getElementById('btn-voltar');

    if (window.history.length > 1 && isInternalUrl(document.referrer)) {
        btnVoltar.style.display = 'block';
    }
});
