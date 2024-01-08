 $(document).ready(function () {
    cardapio.eventos.init();

 })
 var cardapio ={};

 var MEU_CARRINHO = [];
 var MEU_ENDERECO = null;

 var VALOR_CARRINHO= 0;
 var VALOR_ENTREGA =5;
 
 var CELULAR_EMPRESA = `5519998920664`
 var INSTAGRAM_EMPRESA = `https://www.instagram.com/jonathan_balieiro`
 var LINKEDIN_PESSOAL = `https://www.linkedin.com/in/jonathan-balieiro-b83230298/`

 cardapio.eventos ={
    init: () =>{
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoreserva();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.abrirInsta();
        cardapio.metodos.abrirWhats();
        cardapio.metodos.abrirLinkedin();
    }
 }
cardapio.metodos = {

    //obtem a lista de itens do cardapio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU [categoria];
        console.log(filtro);

        if(!vermais ){
            $("#itensCardapio").html('')
            $("verMais").removeClass("hidden");


        }

        $.each(filtro, (i, e )=> {
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)


            //botão ver mais foi clicado (12 itens)


            if ( vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)

            }

            //paginação inicial (8 itens)

            if( !vermais && i < 8) {
                $("#itensCardapio").append(temp)

            }
        })
        //remove o ativo
        $(".container-menu a").removeClass('active')
        // seta o menu para o ativo
        $("#menu-" + categoria).addClass('active')
    },
    //clique no botão de verMais 

    verMais: () =>{
        var ativo = $('.container-menu a.active').attr('id').split('menu-')[1]
        cardapio.metodos.obterItensCardapio(ativo, true )
        $("verMais").addClass("hidden");
    },
    //diminuir a quantidade do carrinho

    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text())
        if(qntdAtual > 0 ){
            $("#qntd-" + id).text(qntdAtual - 1)
        } 
    },
    //aumentar a quantidade do carinho
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text())
        
        $("#qntd-" + id).text(qntdAtual + 1)
        
    },
    //adicionar ao carrinho o item do cardapio 
        adicionarCarrinho: (id) =>{

            let qntdAtual = parseInt($("#qntd-" + id).text())
            
            if (qntdAtual> 0) {

                //obter categoria ativa
                var categoria = $('.container-menu a.active').attr('id').split('menu-')[1]
                //obtem a lista de itens
                let filtro = MENU[categoria]
                //obtem o item 
                let item = $.grep(filtro,(e,i)=>{return e.id == id}) 
                
                if(item.length > 0){
                    // validar se ja existye esse item no carrinho
                    let existe = $.grep(MEU_CARRINHO, (elem,index) => {return elem.id == id})
                    //caso ja exista o item no carrinho so altere a quantidade
                    if (existe.length >0){
                        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
                        MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual
                    }
                    //caso ainda nao exista um item no carrinho adicione ele 
                    else    {
                         item[0].qntd =qntdAtual
                        MEU_CARRINHO.push(item[0])

                    }
                    cardapio.metodos.mensagem('item adicionado ao carrinho', 'green')
                    $("#qntd-" + id ).text(0)

                   cardapio.metodos.atualizarBadgeTotal()
                }

            }

        },
        //atualiza o badge de totais do meu carrinho
        atualizarBadgeTotal: () => {
            var total = 0
            $.each(MEU_CARRINHO, (i,e) =>{
                total += e.qntd
            })
            if (total > 0 ){
                $(".botao-carrinho").removeClass('hidden')
                $(".conatiner-total-carrinho").removeClass('hidden')

            }
            else{
                $(".botao-carrinho").addClass('hidden')
                $(".conatiner-total-carrinho").addClass('hidden')


            }
            $(".badge-total-carrinho").html(total)
        },
        //abrir a modal de carrinho 
        abrirCarrinho: (abrir) =>{
            if (abrir){
                $("#modalCarrinho").removeClass('hidden');
                cardapio.metodos.carregarCarrinho(1);
            }
            else{
                $("#modalCarrinho").addClass('hidden')
            }

        },

        //altera os texto e exibe o botoes das etapas
        carregarEtapa: (etapa) => {
            if (etapa == 1){
                $("#iblTituloEtapa").text('Seu carrinho:')
                $("#itensCarrinho").removeClass('hidden')
                $("#localEntrega").addClass('hidden')
                $("#resumoCarrinho").addClass('hidden')

                $(".etapa").removeClass('active')
                $(".etapa1").addClass('active')

                $("#btnEtapaPedido").removeClass('hidden')
                $("#btnEtapaEndereco").addClass('hidden')
                $("#btnEtapaResumo").addClass('hidden')
                $("#btnEtapaVoltar").addClass('hidden')

            } 
            if (etapa == 2){

                $("#iblTituloEtapa").text('Endereço de entrega:')
                $("#itensCarrinho").addClass('hidden')
                $("#localEntrega").removeClass('hidden')
                $("#resumoCarrinho").addClass('hidden')

                $(".etapa").removeClass('active')
                $(".etapa1").addClass('active')
                $(".etapa2").addClass('active')

                $("#btnEtapaPedido").addClass('hidden')
                $("#btnEtapaEndereco").removeClass('hidden')
                $("#btnEtapaResumo").addClass('hidden')
                $("#btnEtapaVoltar").removeClass('hidden')

            }
            if (etapa == 3){
                $("#iblTituloEtapa").text('Resumo do carrinho:')
                $("#itensCarrinho").addClass('hidden')
                $("#localEntrega").addClass('hidden')
                $("#resumoCarrinho").removeClass('hidden')

                $(".etapa").removeClass('active')
                $(".etapa1").addClass('active')
                $(".etapa2").addClass('active')
                $(".etapa3").addClass('active')

                $("#btnEtapaPedido").addClass('hidden')
                $("#btnEtapaEndereco").addClass('hidden')
                $("#btnEtapaResumo").removeClass('hidden')
                $("#btnEtapaVoltar").removeClass('hidden')

            }

        },
        //voltar etapa
        voltarEtapa:( ) =>{
            let etapa = $(".etapa.active").length;
            cardapio.metodos.carregarEtapa(etapa - 1)
        },
        //carrega a lista de itens no carrinho
        carregarCarrinho: () => {
            cardapio.metodos.carregarEtapa(1);
            
            if (MEU_CARRINHO.length > 0){

                $("#itensCarrinho").html('')
                $.each(MEU_CARRINHO,(i, e)=>{
                    let temp= cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id)
                    .replace(/\${qntd}/g, e.qntd)
                    //para puxar esses codigos acima usamos append
                    $("#itensCarrinho").append(temp);

                    //ultimo item 7
                    
                    if((i + 1) == MEU_CARRINHO.length){
                        cardapio.metodos.carregarValores();
                    }
                    
                    
                    

                })

            }
            else{
                $("#itensCarrinho").html('<p class= "carrinho-vazio"><i class ="fa fa-shopping-bag"></i> Seu carrinho esta vazio. </p>')
                cardapio.metodos.carregarValores();
                
            }

        },
        // diminuir qunatidade do item do carrinho 
        diminuirQuantidadeCarrinho: (id) => {
            let qntdAtual = parseInt($("#qntd-carrinho-" + id).text())

            if(qntdAtual > 1 ){
              $("#qntd-carrinho-" + id).text(qntdAtual - 1)
              cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1)
            } 
            else{
                cardapio.metodos.removeItemCarrinho(id)
            }

        },
        // aumentar a qunatidade do item do carrinho 

        aumentarQuantidadeCarrinho: (id) => {
            let qntdAtual = parseInt($("#qntd-carrinho-" + id).text())
            $("#qntd-carrinho-" + id).text(qntdAtual + 1)
            cardapio.metodos.atualizarCarrinho(id, qntdAtual +1)
 
        },
        //botao remove o item do carrinho
        removeItemCarrinho: (id) => {
            MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id});
            cardapio.metodos.carregarCarrinho();
            cardapio.metodos.atualizarBadgeTotal();
        },
        //atualizar a quantidade atual do carrinho 
        
        atualizarCarrinho: (id, qntd ) =>{
            let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
            MEU_CARRINHO[objIndex].qntd = qntd;
        
            //atualiza o botao carrinho com a quantidade atualizada 
            cardapio.metodos.atualizarBadgeTotal();
            //atualiza os valores em reais e totais do carrinho
            cardapio.metodos.carregarValores();
        },  

        //carrega os valores de subtotal e entrega

        carregarValores:() =>{
            VALOR_CARRINHO = 0;
            $("#lblSubTotal").text('R$ 0,00')
            $("#lblEntrega").text('+ R$ 0,00')
            $("#lblValortotal").text('R$ 0,00')

            $.each(MEU_CARRINHO, (i, e) => {
                VALOR_CARRINHO += parseFloat(e.price * e.qntd);
                if((i + 1) == MEU_CARRINHO.length){
                    $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                    $("#lblEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                    $("#lblValortotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`)
                }
            })

        },
        //carregar a estapa endereco
        carregarEndereco:() => {
            if(MEU_CARRINHO.length<= 0){
                cardapio.metodos.mensagem('Seu carrinho está vazio.')
                return;
            }
            cardapio.metodos.carregarEtapa(2)
        },
        //buscar cep
        buscarCep: () => {
            //cirar a variavel com o valor do cep 
            var cep = $("#txtCep").val().trim().replace(/\D/g,'')
            //verifica se o cep tem algum valor informado 
            if (cep != ""){
                //expressao regular para validar cep 
                var validacep =/^[0-9]{8}$/;

                if(validacep.test(cep)) {

                    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?",function(dados){

                        if (!("erro" in dados)) {
                            //atualiazar os campos com valores retornado 
                            $("#txtEndereco").val(dados.logradouro)
                            $("#txtBairro").val(dados.bairro)
                            $("#txtCidade").val(dados.localidade)
                            $("#ddlUF").val(dados.uf)
                            $("#txtNumero").focus()


                        }
                        else{
                            cardapio.metodos.mensagem(' Cep nao encontrado, escreva as informaçoes manualmente ')
                            $("#txtEndereco").focus()
                        }
                    })



                }
                else{
                    cardapio.metodos.mensagem(' Formato do CEP Invalido ')
                    $("#txtCep").focus()
                }

            }
            else{
                cardapio.metodos.mensagem('Informe o CEP, por favor.')
                $("#txtCep").focus();
            }
        },
        //validação antes do prosseguir para a etapa 3

        resumoPedido: () => {

            let cep = $("#txtCep").val().trim();
            let endereco = $("#txtEndereco").val().trim();
            let bairro = $("#txtBairro").val().trim();
            let cidade = $("#txtCidade").val().trim();
            let numero = $("#txtNumero").val().trim();
            let complemento = $("#txtComplemento").val().trim();
            let uf = $("#ddlUF").val();

            if (cep.length <=0) {
                cardapio.metodos.mensagem('Informe o Cep, por favor ')
                $("#txtCep").focus();
                return;
            }
            if (endereco.length <=0) {
                cardapio.metodos.mensagem('Informe o endereco, por favor ');
                $("#txtEndereco").focus();
                return;
            }
            if (bairro.length <= 0) {
                cardapio.metodos.mensagem('Informe o bairro, por favor ');
                $("#txtBairro").focus();
                return;
            }
            if (cidade.length <= 0) {
                cardapio.metodos.mensagem('Informe a cidade, por favor ');
                    $("#txtCidade").focus();
                return;
            }
            if (numero.length <= 0) {
                cardapio.metodos.mensagem('Informe a numero, por favor ');
                $("#txtNumero").focus();
                return;
            }
            if (complemento.length <=0) {
                cardapio.metodos.mensagem('Informe a complemento, por favor ');
                $("#txtComplemento").focus();
                return;
            }
            if(uf == "-1") {
                cardapio.metodos.mensagem('Informe a UF, por favor')
                $("#ddlUF").focus()
                return;

            }
             
            MEU_ENDERECO = {
                cep: cep,
                endereco: endereco,
                bairro: bairro,
                cidade: cidade,
                uf: uf, 
                numero: numero,
                complemento: complemento
            }

            cardapio.metodos.carregarEtapa(3)
            cardapio.metodos.carregarResumo();

        },
        //carrega os itens do pedido 
        carregarResumo: () => {
            $("#listaItensResumo").html('')
            
            $.each(MEU_CARRINHO,(i, e) => {
                let temp= cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${qntd}/g, e.qntd)


                 $("#listaItensResumo").append(temp)
            });
            $("#resumoEndereco").html(`${MEU_ENDERECO.endereco},${MEU_ENDERECO.numero},${MEU_ENDERECO.bairro}`);
            $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`)

            cardapio.metodos.finalizarPedido()
        },
        //ele finaliza o botao do whatsapp
        finalizarPedido: () => {

            if (MEU_CARRINHO.length > 0 && MEU_ENDERECO !=null){

                var texto = 'Ola gostaria de fazer um pedido'
                texto += `\n* Itens do pedido:* \n\n\${itens}`
                texto += '\n*Endereco de entrega:*'
                texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`
                texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`
                texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;


                var itens = '';
                $.each(MEU_CARRINHO, (i, e) =>{
                    itens += `*${e.qntd}x* ${e.name}.......R$ ${e.price.toFixed(2).replace('.', ',')}\n`

                    if ((i + 1)== MEU_CARRINHO.length){

                        texto = texto.replace(/\${itens}/g, itens)

                        console.log(texto)

                        //converte a URL

                        let encode = encodeURI(texto);
                        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`
                        $("#btnEtapaResumo").attr('href', URL)

                    }
                })
            }

        },
        //carrega botao de reserva
        carregarBotaoreserva: () => {

            var texto = 'Ola gostaria de fazer uma *reserva*'

            let encode= encodeURI(texto)
            let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

            $("#btnReserva").attr('href', URL)
        },
        // carrega botao de ligar 
        carregarBotaoLigar:() => {
            $("#btnLigar").attr('href', `${CELULAR_EMPRESA}`)
        },
        // abre depoimentos 
        abrirDepoimentos: (depoimento) => {
            $("#depoimento-1").addClass('hidden')
            $("#depoimento-2").addClass('hidden')
            $("#depoimento-3").addClass('hidden')

            $("#btnDepoimento-1").removeClass('active')
            $("#btnDepoimento-2").removeClass('active')
            $("#btnDepoimento-3").removeClass('active')

            $("#depoimento-" + depoimento).removeClass('hidden')
            $("#btnDepoimento-" + depoimento).addClass('active')
            
        },
        //codigos abaixo feito sozinhos (* unico que nao achei viavel para ser feito foi o facebook)
        abrirInsta:() => {

            $("#insta").attr('href', `${INSTAGRAM_EMPRESA}`)
        },

        abrirWhats: () =>{
            
            let URL = `https://wa.me/${CELULAR_EMPRESA}`
            $("#whatss").attr('href', URL)

        },

        abrirLinkedin: () =>{ 
            $("#linkedin").attr('href', `${LINKEDIN_PESSOAL}`)
        },

        //mensagens 
        mensagem: (texto, cor = 'red', tempo= 3500) =>{

            let id= Math.floor(Date.now() * Math.random()).toString();

            let msg = `<div id="msg-${id}" class= "animated fadeInDown toast ${cor}">${texto} </div>`;

            $("#container-mensagens").append(msg);

            setTimeout(() => {
                $("#msg-" + id).removeClass('fadeInDown')
                $("#msg-" + id).addClass('fadeOutUp')
                setTimeout(() => {
                    $("#msg-" + id ).remove();
                },800)
            }, tempo)
        }
 }
 cardapio.templates = {
    item: `
                        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-4 animated fadeInUp">
                            <div class="card card-item" id="\${id}">
                                <div class="img-produto">
                                    <img src="\${img}" />
                                </div>
                                <p class="title-produto text-center mt-4">
                                    <b>\${name}</b>
                                </p>
                                <p class="price-produto text-center">
                                    <b>R$ \${price}</b>
                                </p>
                                <div class="add-carrinho">
                                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                                    <span class="add-numeros-itens"id="qntd-\${id}">0</span>
                                    <span class="btn-mais"onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                                </div>
                            </div>
                        </div>
    
    `,
    itemCarrinho:`

        <div class="col-12 item-carrinho">
            <div class="img-produto">
                        <img src="\${img}" alt="">
            </div>
                            <div class="dados-produto">
                                <p class="title-produto"><b>\${name}</b></p>
                                <p class="price-produto"><b>\${price}</b></p>
                            </div>
                            <div class="add-carrinho">
                                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                                <span class="add-numeros-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                                <span class="btn-mais"  onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removeItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
                            </div>
                            
        </div>    
    `,
    itemResumo:`
                    <div class="col-12 item-carrinho resumo">
                        <div class="img-produto-resumo">
                            <img src="\${img}">
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto-resumo">
                                <b>\${name}</b>
                            </p>
                            <p class="price-produto-resumo">
                                <b>R$\${price}</b>
                            </p>
                        </div>
                        <p class="quantidade-produto-resumo">
                            x <b>\${qntd}</b>
                        </p>
                     </div>
    
    
    
    
    `
 }
