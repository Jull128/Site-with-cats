const $wrapper = document.querySelector("[data-wrapper]");

const $addButton = document.querySelector("[data-add_button]");

const $modal = document.querySelector("[data-modal]");

const $spinner = document.querySelector('[data-spinner]');

const $closeModal = document.querySelector('[data-bs-dismiss]');

const $overlay = document.querySelector('.dm-overlay');

const api = new Api('lula');

const setRate = function (n) {
    let fill = "<img src='img/cat-2.svg' alt='<3'>"
    let stroke = "<img src='img/cat-1.svg' alt=':('>"
    let rate = "", cnt = 10;
    for (let i = 0; i < cnt; i++) {
        rate += i < n ? fill : stroke;
    }
    return rate;
}

const generationCatCard = (cat) => `<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem;">
<img src="${cat.image}" class="card-img-top" alt="${cat.name}">
<div class="card-body">
  <h5 class="card-title">${cat.name}</h5>
  <p class="rate">${setRate(cat.rate)}</p>
  <div class='d-flex justify-content-sm-evenly'>
  <button data-action="show" class="btn btn-primary">show</button>
  <button data-action="delete" class="btn btn-danger">delete</button>
  </div>
</div>
</div>`

const showModalCat = (
    cat
) => `<div data-card_show class="card__show">
  <div class="row g-0">
    <div class="col-md-5">
      <img src="${cat.image}" class="img_card_show" alt="${cat.name}">
    </div>
    <div class="col-md-6">
      <div class="card-body">
        <h3 class="card-title text-left mt-2">${cat.name}</h3>
        <p class="card-text text-left p-3 ">${cat.description}</p>
        <button data-action-add class="btn btn-success btn-success-edit"">Edit</button>
      </div>
    </div>
    <div class="col-md-1 pt-3">
    <button data-bs-dismiss type="button" class="btn-close" aria-label="Close"></button>
    </div>
  </div>
</div>`;


const updShowModalCat = (cat) => `
<div data-modal-edit class="modal-wrapper">

<div class="d-flex justify-content-center custom-modal">
<form name="catsFormEdit">
<div>
<h3>Edit the cat</h3>
<label for="name">Name</label>
<input type="text" class="form-control mb-2" placeholder="Введите имя" name="name" id="Name" value="${cat.name}" />

<label for="id">Id</label>
<input type="text" class="form-control mb-2" name="id" id="id" placeholder="Число" value="${cat.id}" disabled />

<label for="image">Url image</label>
<input type="url" class="form-control mb-2" name="image" id="image" placeholder="https://" value="${cat.image}" />

<label for="age">Age</label>
<input type="number" class="form-control mb-2" name="age" id="age" value="${cat.age}" />

<label for="rate">Rate</label>
<input type="number" min="0" max="10" class="form-control mb-2" name="rate" id="rate" value="${cat.rate}"/>

<div class="mb-3 form-check">
<label for="favorite" class="form-check-label">Check me if your favorite</label>
<input type="checkbox" class="form-check-input mb-2" name="favorite" id="favorite" />
</div>

<label for="description">Description</label>
<input type="text" class="form-control mb-2" name="description" id="description" value="${cat.description}"/>
<button data-btn_save type="submit" class="btn btn-primary">Save</button>
</div>

</form>
</div>
</div>`;

$wrapper.addEventListener('click', (event) => {
    switch (event.target.dataset.action) {
        case 'delete':
            const $currentCard = event.target.closest("[data-card_id]");
            const catId = $currentCard.dataset.card_id;
            api.delCat(catId);
            $currentCard.remove()
            break;
        case 'show':
            const $currentCardShow = event.target.closest("[data-card_id]");
            const catIdShow = $currentCardShow.dataset.card_id;
            let edit;
            let cardObj;
            let $currentCardShowTime;
            api.getCat(catIdShow).then((response) => response.json()).then((data) => {
                $modal.insertAdjacentHTML('beforebegin', showModalCat(data));
                edit = document.querySelector('[data-action-add]');
                cardObj = data;
                 setTimeout(() => {
                $currentCardShowTime = document.querySelector('[data-card_show]');
                            }, 100);
            
                            const $closeModal = document.querySelector('[data-bs-dismiss]');

            $overlay.classList.remove('hidden');

            $closeModal.addEventListener('click', () => {
                $overlay.classList.add('hidden')
                $currentCardShowTime.remove();
            });

            $overlay.addEventListener('click', () => {
                $overlay.classList.add('hidden');
                $currentCardShowTime.remove();
            });

            setTimeout(() => {
                edit.addEventListener('click', () => {
                    $modal.insertAdjacentHTML('beforebegin',
                        updShowModalCat(cardObj)
                    );
                    $currentCardShowTime.remove();
                    const $updCard = document.querySelector('[data-btn_save]');
                    console.log($updCard)
                    $updCard.addEventListener('click', () => {
                    
                        

                        api.updCat(catId);
                    })
                });


                $overlay.classList.remove('hidden');
                $overlay.addEventListener('click', () => {
                    $overlay.classList.add('hidden');
                    let $modalEdit = document.querySelector('[data-modal-edit]');
                    $modalEdit.remove();
                });
            }, 100);
            });
            
           

            break;
    }
})

document.forms.catsForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const data = Object.fromEntries(new FormData(event.target).entries());

    data.age = Number(data.age);
    data.id = Number(data.id);
    data.rate = Number(data.rate);
    data.favorite = data.favorite === 'on';
    console.log(data);

    api.addCat(data).then(res => res.ok && $modal.classList.add('hidden'))
    //catch
});

$addButton.addEventListener('click', () => {
    $modal.classList.remove('hidden');
    $overlay.classList.remove('hidden');

    $closeModal.addEventListener('click', () => {
        $modal.classList.add('hidden');
        $overlay.classList.add('hidden')
    });

    $overlay.addEventListener('click', () => {
        $modal.classList.add('hidden');
        $overlay.classList.add('hidden')
    });
});

api.getCats()
    .then((responce) => {
        return responce.json()
    })
    .then((data) => {
        setTimeout(() => {
            $spinner.classList.add('hidden')
            data.forEach(cat => {
                $wrapper.insertAdjacentHTML('beforeend', generationCatCard(cat))
            })
        }, 2000)
    });