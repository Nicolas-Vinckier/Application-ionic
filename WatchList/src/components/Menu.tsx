import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
} from "@ionic/react";
import { checkmarkOutline, eyeOutline } from "ionicons/icons";

function Menu() {
  return (
    <IonMenu side="start" contentId="main-content">
      <h1>Menu</h1>
      <IonContent>
        <IonList>
          {/* Liste des éléments dans le menu */}
          <IonItem button routerLink="/home">
            <IonIcon slot="start" icon={eyeOutline} />
            <IonLabel>En cours</IonLabel>
          </IonItem>
          <IonItem button routerLink="/finish">
            <IonIcon slot="start" icon={checkmarkOutline} />
            <IonLabel>Fini</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

export default Menu;
