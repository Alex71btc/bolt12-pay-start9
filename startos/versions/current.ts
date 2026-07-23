import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:3',

  releaseNotes: {
    en_US:
      'Fixes the Auto-Configure task on LND 0.21. LND advertises onion messages natively from 0.21 and no longer exposes the setting at all, so the task was being posted to 0.21 nodes as a critical item that could never be satisfied — and enabling it anyway crash-loops LND. The task is now posted only to LND versions that actually need it (below 0.21), and clears itself automatically when LND is upgraded. Dependency addresses are also resolved reactively now, so BOLT12 Pay no longer restarts every time Bitcoin Core or LND updates, and recovers on its own when a dependency is installed after it, removed, or changes port. Also includes internal updates for start-sdk 2.0.x.',
    es_ES:
      'Corrige la tarea de Configuración automática en LND 0.21. LND anuncia los mensajes onion de forma nativa a partir de la 0.21 y ya no expone ese ajuste, por lo que la tarea se enviaba a los nodos 0.21 como un elemento crítico imposible de satisfacer; y activarlo de todos modos hace que LND entre en un bucle de fallos. Ahora la tarea solo se envía a las versiones de LND que realmente la necesitan (inferiores a la 0.21) y se borra automáticamente al actualizar LND. Las direcciones de las dependencias también se resuelven ahora de forma reactiva, por lo que BOLT12 Pay ya no se reinicia cada vez que se actualizan Bitcoin Core o LND, y se recupera por sí solo cuando una dependencia se instala después, se elimina o cambia de puerto. También incluye actualizaciones internas para start-sdk 2.0.x.',
    de_DE:
      'Behebt die Auto-Konfigurations-Aufgabe unter LND 0.21. LND kündigt Onion-Nachrichten ab 0.21 nativ an und stellt die Einstellung gar nicht mehr bereit, sodass die Aufgabe auf 0.21-Knoten als kritischer Punkt erschien, der nie erfüllt werden konnte — und wird sie dennoch aktiviert, gerät LND in eine Absturzschleife. Die Aufgabe wird jetzt nur noch an LND-Versionen gestellt, die sie tatsächlich benötigen (unter 0.21), und löscht sich beim Upgrade von LND automatisch. Abhängigkeitsadressen werden außerdem jetzt reaktiv aufgelöst, sodass BOLT12 Pay nicht mehr bei jedem Update von Bitcoin Core oder LND neu startet und sich selbst erholt, wenn eine Abhängigkeit nachträglich installiert oder entfernt wird oder ihren Port ändert. Enthält außerdem interne Aktualisierungen für start-sdk 2.0.x.',
    pl_PL:
      'Naprawia zadanie Automatycznej konfiguracji na LND 0.21. Od wersji 0.21 LND natywnie ogłasza wiadomości onion i w ogóle nie udostępnia już tego ustawienia, więc zadanie trafiało na węzły 0.21 jako element krytyczny, którego nie dało się spełnić — a włączenie go mimo to powoduje pętlę awarii LND. Zadanie jest teraz wysyłane tylko do tych wersji LND, które faktycznie go potrzebują (poniżej 0.21), i samo znika po aktualizacji LND. Adresy zależności są teraz również rozwiązywane reaktywnie, więc BOLT12 Pay nie uruchamia się ponownie przy każdej aktualizacji Bitcoin Core czy LND i sam wraca do działania, gdy zależność zostanie zainstalowana później, usunięta lub zmieni port. Zawiera również wewnętrzne aktualizacje dla start-sdk 2.0.x.',
    fr_FR:
      "Corrige la tâche de Configuration automatique sur LND 0.21. Depuis la 0.21, LND annonce nativement les messages onion et n'expose plus du tout ce réglage : la tâche était donc proposée aux nœuds 0.21 comme un élément critique impossible à satisfaire — et l'activer malgré tout fait entrer LND dans une boucle de plantage. La tâche n'est désormais proposée qu'aux versions de LND qui en ont réellement besoin (antérieures à la 0.21) et disparaît automatiquement lors de la mise à niveau de LND. Les adresses des dépendances sont également résolues de façon réactive : BOLT12 Pay ne redémarre plus à chaque mise à jour de Bitcoin Core ou de LND et se rétablit tout seul lorsqu'une dépendance est installée après lui, supprimée, ou change de port. Inclut également des mises à jour internes pour start-sdk 2.0.x.",
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
