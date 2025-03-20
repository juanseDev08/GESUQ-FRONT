import Swal from "sweetalert2";

export class Utilities {

    public static mensajeError( tittle: string ,mensaje: string) {
        Swal.fire({
          icon: "error",
          title: tittle,
          text: mensaje ,
          didOpen: () => {
            const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
            if (swalContainer) {
              swalContainer.style.zIndex = '9999';
            }
          }
        });
      }
    
}