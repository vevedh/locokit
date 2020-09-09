import * as Knex from 'knex'
import { GROUPS } from '../glossary/user_group'
import { VIEWS, WORKSPACE_ID, CHAPTERS } from '../glossary/view'
import { GROUP_ROLE } from "@locokit/lck-glossary";

export async function seed (knex: Knex): Promise<any> {

  /**
   * Chapters
   */
  await knex('chapter').insert([
    {
      id: CHAPTERS.SUPPLIER,
      text: 'Fournisseur',
      workspace_id: WORKSPACE_ID
    }, {
      id: CHAPTERS.BENEFICIARY,
      text: 'Bénéficiaire',
      workspace_id: WORKSPACE_ID
    }, {
      id: CHAPTERS.VLOGISTIQUE,
      text: 'v-logistique',
      workspace_id: WORKSPACE_ID
    }, {
      id: CHAPTERS.ROZO,
      text: 'Rozo',
      workspace_id: WORKSPACE_ID
    }, {
      id: CHAPTERS.MORIO,
      text: 'Morio',
      workspace_id: WORKSPACE_ID
    }, {
      id: CHAPTERS.FUB,
      text: 'FUB',
      workspace_id: WORKSPACE_ID
    }
  ])

  /**
   * Pages
   */
  await knex('page').insert([
    {
      id: '414ce692-4b8f-4068-ba8b-d3c561fae25a',
      text: 'Demandes',
      chapter_id: CHAPTERS.SUPPLIER
    }, {
      id: '53646407-caf7-4dd4-9422-edd378dd647d',
      text: 'Gestion flotte vélos',
      chapter_id: CHAPTERS.SUPPLIER
    }, {
      id: 'f83be2bb-1cbb-4fb4-8fa1-b5dffc3062cc',
      text: 'Maintenances préventives',
      chapter_id: CHAPTERS.SUPPLIER
    }, {
      id: '41910cbc-4065-4399-b05f-b73893a50dbb',
      text: 'Maintenances curatives',
      chapter_id: CHAPTERS.SUPPLIER
    }, {
      id: '5b9461c8-9a0d-4326-97fc-bbe61663a4eb',
      text: 'Informations prestataires',
      chapter_id: CHAPTERS.SUPPLIER
    }, {
      id: 'f199297d-ec2e-4b44-bb54-e44734e3eb01',
      text: 'Messagerie',
      chapter_id: CHAPTERS.SUPPLIER
    }, {
      id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee',
      text: 'Usage vélos',
      chapter_id: CHAPTERS.BENEFICIARY
    }, {
      id: '4d427df2-79b2-4aba-84b1-cc0c98421d6d',
      text: 'Assistance',
      chapter_id: CHAPTERS.BENEFICIARY
    }, {
      id: 'f9bdf57a-de4d-4476-a765-84e6802d1342',
      text: 'Messagerie',
      chapter_id: CHAPTERS.BENEFICIARY
    }, {
      id: '596848de-1287-4b36-a8db-1cd4c228e468',
      text: 'Sensibilisation formation',
      chapter_id: CHAPTERS.BENEFICIARY
    }, {
      id: 'b23c29f9-ecfd-4f63-9f10-9b919e6a752f',
      text: 'Stock vélos',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: '6d177b3f-a613-4557-afce-a0db2b4e980b',
      text: 'Pré-bénéficiaires',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: 'c8323900-8f84-4dc2-82aa-e6c8d898ccee',
      text: 'Bénéficiaires',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: '1f50ffd6-3c48-4c8a-a09e-34b85e89682d',
      text: 'Rozo',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: 'baa61fef-dbeb-4fa4-9f33-a52dd5252afc',
      text: 'Fournisseurs de solutions',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: '113727d6-e21d-497b-a350-6718aae02b93',
      text: 'Morio',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: '23453d24-c2bb-4ee8-9bb1-638512e43b81',
      text: 'Sensibilisation Formation Assistance',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: 'c8b23f69-7067-48cf-8b3a-5ef15ad5cda1',
      text: 'Messagerie',
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      id: 'a1d54446-790a-4551-9278-ce5d2765fc44',
      text: 'Pré-bénéficiaires Bénéficiaires',
      chapter_id: CHAPTERS.ROZO
    }, {
      id: '1cc188e6-7c53-4460-b527-8a288bbed107',
      text: 'Dossier en instruction',
      chapter_id: CHAPTERS.ROZO
    }, {
      id: '1e158ffa-1d84-4800-a215-cf9cd92b6083',
      text: 'Utilisation vélos',
      chapter_id: CHAPTERS.ROZO
    }, {
      id: 'a2257b27-cf91-48fa-89be-3ee66a79c329',
      text: 'Messagerie',
      chapter_id: CHAPTERS.ROZO
    }, {
      id: '7579786b-3136-4a78-b0aa-1f601f1e49f0',
      text: 'Incident',
      chapter_id: CHAPTERS.MORIO
    }, {
      id: '52729f44-c450-4044-9dcb-7632fdbb1653',
      text: 'Traceurs',
      chapter_id: CHAPTERS.MORIO
    }, {
      id: 'a5797f07-df6c-4235-a1c3-8fff772d6a43',
      text: 'Messagerie',
      chapter_id: CHAPTERS.MORIO
    }, {
      id: '1e2c3368-5dff-426c-8110-648eeccc30e9',
      text: 'Formations',
      chapter_id: CHAPTERS.FUB
    }, {
      id: '339e6670-2b4b-459f-8ed7-b8ad7f8003eb',
      text: 'Messagerie',
      chapter_id: CHAPTERS.FUB
    }
  ])

  /**
   * Containers
   */
  await knex('container').insert([
    {
      id: 'dd533aba-06c3-4f11-a811-874cd6803c16',
      text: 'Container Fournisseur Demandes',
      page_id: '414ce692-4b8f-4068-ba8b-d3c561fae25a'
    }, {
      id: '42be6c09-a6df-41c5-99e3-295d4696b492',
      text: 'Container Fournisseur Gestion Flotte',
      page_id: '53646407-caf7-4dd4-9422-edd378dd647d'
    }, {
      id: '3e5f7f61-8664-4db1-92f5-d87650b39e87',
      text: 'Container Fournisseur Maintenance préventive',
      page_id: 'f83be2bb-1cbb-4fb4-8fa1-b5dffc3062cc'
    }, {
      id: '4d696142-5ac3-47bb-bfce-7bbbb0b59a6d',
      text: 'Container Fournisseur Maintenance curative',
      page_id: '41910cbc-4065-4399-b05f-b73893a50dbb'
    }, {
      id: '0e6a7204-7fa2-4f38-9112-2fe255bf9b3a',
      text: 'Container Fournisseur Information prestataire page en construction',
      page_id: '5b9461c8-9a0d-4326-97fc-bbe61663a4eb'
    }, {
      id: 'c8a24d65-a9ba-4b73-811d-0096f523904a',
      text: 'Container Fournisseur Messagerie',
      page_id: 'f199297d-ec2e-4b44-bb54-e44734e3eb01'
    }, {
      id: 'da283b02-0679-424c-98b3-95f2779655be',
      text: 'Container Bénéficiare Usage vélo',
      page_id: '4b64ffc0-229a-47ae-a5a2-0505fa9890ee'
    }, {
      id: 'fa17cfc4-66b9-455f-96e6-9746c0c7f5f0',
      text: 'Container Bénéficiare Assistance page en construction',
      page_id: '4d427df2-79b2-4aba-84b1-cc0c98421d6d'
    }, {
      id: '916bbc56-c26e-44b7-8107-46f2c4d21d2e',
      text: 'Container Bénéficiare messagerie',
      page_id: 'f9bdf57a-de4d-4476-a765-84e6802d1342'
    }, {
      id: 'ff033f73-0ebc-41e0-acc6-7981caae15ad',
      text: 'Container Bénéficiare sensibilisation',
      page_id: '596848de-1287-4b36-a8db-1cd4c228e468'
    }, {
      id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
      text: 'Container V-logistique stock vélos',
      page_id: 'b23c29f9-ecfd-4f63-9f10-9b919e6a752f'
    }, {
      id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
      text: 'Container V-logistique Pré-bénéficiaire',
      page_id: '6d177b3f-a613-4557-afce-a0db2b4e980b'
    }, {
      id: '943fe488-d438-46c0-8ce8-74de326a4928',
      text: 'Container V-logistique Bénéficiaire',
      page_id: 'c8323900-8f84-4dc2-82aa-e6c8d898ccee'
    }, {
      id: '292d8b92-de2a-11ea-87d0-0242ac130003',
      text: 'Container V-logistique Rozo',
      page_id: '1f50ffd6-3c48-4c8a-a09e-34b85e89682d'
    }, {
      id: '171c8238-ba2b-4306-8590-455db8fe83a7',
      text: 'Container V-logistique Fournisseur de solutions',
      page_id: 'baa61fef-dbeb-4fa4-9f33-a52dd5252afc'
    }, {
      id: 'decd0321-2776-4397-861b-536a0b4ed943',
      text: 'Container V-logistique Morio',
      page_id: '113727d6-e21d-497b-a350-6718aae02b93'
    }, {
      id: '16097516-23b5-49c6-82cc-271650db06e2',
      text: 'Container V-logistique Sensibilisation Formation',
      page_id: '23453d24-c2bb-4ee8-9bb1-638512e43b81'
    }, {
      id: 'e0d76cf5-a912-49b2-a058-a32ccce19251',
      text: 'Container V-logistique Messagerie page en construction',
      page_id: 'c8b23f69-7067-48cf-8b3a-5ef15ad5cda1'
    }, {
      id: '0288209d-be73-450b-8ba8-30e890b36f60',
      text: 'Container Rozo Pré-bénéficiaire Bénéficiaire',
      page_id: 'a1d54446-790a-4551-9278-ce5d2765fc44'
    }, {
      id: '1e6ba31f-9eb0-44b4-beb3-4c0bda0c5b6d',
      text: 'Container Rozo Dossier en instruction',
      page_id: '1cc188e6-7c53-4460-b527-8a288bbed107'
    }, {
      id: 'a975cc00-58ae-435e-bd18-ecc35412350b',
      text: 'Container Rozo Utilisation vélo',
      page_id: '1e158ffa-1d84-4800-a215-cf9cd92b6083'
    }, {
      id: 'e6897e98-e1fc-47b6-8862-9c7cd93caee6',
      text: 'Container Rozo Messagerie page en construction',
      page_id: 'a2257b27-cf91-48fa-89be-3ee66a79c329'
    }, {
      id: '3a05e853-f62b-4672-a48e-63773773fc09',
      text: 'Container Morio Incidents',
      page_id: '7579786b-3136-4a78-b0aa-1f601f1e49f0'
    }, {
      id: '396f1826-c2ee-4fad-a78b-7daab248b1f3',
      text: 'Container Morio Traceurs',
      page_id: '52729f44-c450-4044-9dcb-7632fdbb1653'
    }, {
      id: '91910357-aa2b-4521-9a51-ef40857a8725',
      text: 'Container Morio Messagerie page en construction',
      page_id: 'a5797f07-df6c-4235-a1c3-8fff772d6a43'
    }, {
      id: '2b523341-e7f8-48b8-bf8f-e1dfd8e507d3',
      text: 'Container Fub Formations',
      page_id: '1e2c3368-5dff-426c-8110-648eeccc30e9'
    }, {
      id: '87d83ee4-6f8a-46b7-ad6c-79ed110e35ea',
      text: 'Container fub Messagerie page en construction',
      page_id: '339e6670-2b4b-459f-8ed7-b8ad7f8003eb'
    }
  ])

  /**
   * Blocks
   */
  await knex('block').insert([
    {
      id: '3f70841d-a6fe-4586-b130-038331eacd7c',
      title: 'Vélos livrés',
      container_id: '42be6c09-a6df-41c5-99e3-295d4696b492',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.SUPPLIER.FLEET
      })
    }, {
      id: '875b2539-134f-4493-a9de-a71fe927bc94',
      title: 'Vélos à maintenir',
      container_id: '3e5f7f61-8664-4db1-92f5-d87650b39e87',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE
      })
    }, {
      id: 'b69f3078-45e7-4934-ade2-4dd9972f2dfb',
      title: 'Vélos ayant des réparations',
      container_id: '4d696142-5ac3-47bb-bfce-7bbbb0b59a6d',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE
      })
    }, {
      id: 'd7933493-b5d0-4363-a5e8-caf0abef6d05',
      title: 'Mes vélos',
      container_id: 'da283b02-0679-424c-98b3-95f2779655be',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.BENEFICIARY.BICYCLE_USE
      })
    }, {
      id: '7b2dd5d0-b6d3-43d9-aadc-91de0a1ec84b',
      title: 'Listing vélo',
      container_id: '5cdbf483-aafe-4b6a-9ad1-99faf0a5e5f4',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.VLO.BICYCLE_STOCK
      })
    }, {
      id: '8958475f-e22e-4c8f-b480-b7911654d167',
      title: 'Listing fournisseur',
      container_id: '171c8238-ba2b-4306-8590-455db8fe83a7',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.VLO.SUPPLIER
      })
    }, {
      id: '07f3668f-c870-4761-8572-fc3ce447a50f',
      title: 'Listing pré-bénéficiaire',
      container_id: 'e8a4061b-a6a4-40b8-b309-f7658e949099',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.VLO.PRE_BENEFICIARY
      })
    }, {
      id: '16743e21-d6ba-4630-b14a-6e9a78ffac26',
      title: 'Listing bénéficiaire',
      container_id: '943fe488-d438-46c0-8ce8-74de326a4928',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.VLO.BENEFICIARY
      })
    }, {
      id: '8d3db4a1-ec19-4192-992c-aec2a126ba0b',
      title: 'Listing formation',
      container_id: 'ff033f73-0ebc-41e0-acc6-7981caae15ad',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.BENEFICIARY.TRAINING
      })
    }, {
      id: '4ffcd80e-de2a-11ea-87d0-0242ac130003',
      title: 'Liste des demandes',
      container_id: '292d8b92-de2a-11ea-87d0-0242ac130003',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.VLO.ROZO
      })
    }, {
      id: '544c1cbc-1b03-45c8-a8c4-455bba29af41',
      title: 'Liste des traceurs',
      container_id: 'decd0321-2776-4397-861b-536a0b4ed943',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.VLO.MORIO
      })
    }, {
      id: 'cab1c928-0125-4ed1-a3ab-6875cf8351fc',
      title: 'Liste des formations et Assistance',
      container_id: '16097516-23b5-49c6-82cc-271650db06e2',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.VLO.FORMATION
      })
    }, {
      id: '613c0d9c-4fe8-4192-90bb-c9bbb013efbf',
      title: 'Liste des demandes',
      container_id: 'dd533aba-06c3-4f11-a811-874cd6803c16',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.SUPPLIER.REQUEST
      })
    }, {
      id: '15b69384-0ff7-4e44-b261-7270076d668f',
      title: 'Liste des pré-bénéficiaires & bénéficiaires',
      container_id: '0288209d-be73-450b-8ba8-30e890b36f60',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.ROZO.BENEFICIARY
      })
    }, {
      id: 'e65ba238-f739-441a-a103-3d9e6ee448a9',
      title: 'Liste des dossiers',
      container_id: '1e6ba31f-9eb0-44b4-beb3-4c0bda0c5b6d',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.ROZO.FOLDER
      })
    }, {
      id: '25b75be7-bc03-4b2c-8460-70667228aa9d',
      title: 'Liste des vélos',
      container_id: 'a975cc00-58ae-435e-bd18-ecc35412350b',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.ROZO.BIKE
      })
    }, {
      id: 'c37ba55e-27e3-4582-8841-2b7975dbd3a6',
      title: 'Liste des incidents',
      container_id: '3a05e853-f62b-4672-a48e-63773773fc09',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.MORIO.INCIDENT
      })
    }, {
      id: 'd186504a-79e0-499c-b8ba-d25377b1e51b',
      title: 'Liste des traceurs',
      container_id: '396f1826-c2ee-4fad-a78b-7daab248b1f3',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.MORIO.TRACER
      })
    }, {
      id: '45bfbf6a-3825-4674-bc60-64866417a999',
      title: 'Liste des formations',
      container_id: '2b523341-e7f8-48b8-bf8f-e1dfd8e507d3',
      type: 'TableView',
      settings: JSON.stringify({
        id: VIEWS.FUB.FORMATION
      })
    }, {
      id: '59b05157-e4d8-4164-8ba5-1efc0fb68829',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d\'envoyer un mail à contact@v-logistique.com.

      En cas de sinistre, merci de contacter la hot-line Morio au 07 80 99 24 19.
    `
      }),
      container_id: '916bbc56-c26e-44b7-8107-46f2c4d21d2e',
      type: 'Paragraph'
    }, {
      id: '7815050f-aa93-4be5-8f18-6fe6adc866e1',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
      }),
      container_id: 'c8a24d65-a9ba-4b73-811d-0096f523904a',
      type: 'Paragraph'
    }, {
      id: '2192b05b-e5aa-4058-b9fa-b99d611aed03',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
      }),
      container_id: '0e6a7204-7fa2-4f38-9112-2fe255bf9b3a',
      type: 'Paragraph'
    }, {
      id: 'a960955f-f9ac-406e-a1c4-f7b192153c0c',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
      }),
      container_id: 'fa17cfc4-66b9-455f-96e6-9746c0c7f5f0',
      type: 'Paragraph'
    }, {
      id: 'f996615d-0a30-4df2-bfd2-01d87a6841a8',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
      }),
      container_id: 'e0d76cf5-a912-49b2-a058-a32ccce19251',
      type: 'Paragraph'
    }, {
      id: 'eac25152-89ad-435e-b5f4-37f3ae6783da',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
      }),
      container_id: 'e6897e98-e1fc-47b6-8862-9c7cd93caee6',
      type: 'Paragraph'
    }, {
      id: 'aa61aa4e-e5d0-44c2-88c3-0ec8cd7486ea',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
      }),
      container_id: '91910357-aa2b-4521-9a51-ef40857a8725',
      type: 'Paragraph'
    }, {
      id: 'a08f0b8c-a810-40ad-8e46-b9f6b0613eda',
      settings: JSON.stringify({
        content: `
      Page en construction.

      Pour tout contact, merci d'envoyer un mail à contact@v-logistique.com.
      `
      }),
      container_id: '87d83ee4-6f8a-46b7-ad6c-79ed110e35ea',
      type: 'Paragraph'
    }
  ])

  /**
   * Workspace group associations
   */
  await knex('group_has_workspace').insert([
    {
      group_id: GROUPS.ADMIN,
      workspace_id: WORKSPACE_ID,
      role: GROUP_ROLE.OWNER,
      permission: null,
      chapter_id: CHAPTERS.VLOGISTIQUE
    }, {
      group_id: GROUPS.BENEFICIARY,
      workspace_id: WORKSPACE_ID,
      role: GROUP_ROLE.MEMBER,
      permission: JSON.stringify([
        'VIEW_READ_2'
      ]),
      chapter_id: CHAPTERS.BENEFICIARY
    }, {
      group_id: GROUPS.SUPPLIER,
      workspace_id: WORKSPACE_ID,
      role: GROUP_ROLE.MEMBER,
      permission: JSON.stringify([
        'VIEW_READ_1'
      ]),
      chapter_id: CHAPTERS.SUPPLIER
    }, {
      group_id: GROUPS.ROZO,
      workspace_id: WORKSPACE_ID,
      role: GROUP_ROLE.MEMBER,
      permission: JSON.stringify([
        'VIEW_READ_1'
      ]),
      chapter_id: CHAPTERS.ROZO
    }, {
      group_id: GROUPS.MORIO,
      workspace_id: WORKSPACE_ID,
      role: GROUP_ROLE.MEMBER,
      permission: JSON.stringify([
        'VIEW_READ_1'
      ]),
      chapter_id: CHAPTERS.MORIO
    }, {
      group_id: GROUPS.FUB,
      workspace_id: WORKSPACE_ID,
      role: GROUP_ROLE.MEMBER,
      permission: JSON.stringify([
        'VIEW_READ_1'
      ]),
      chapter_id: CHAPTERS.FUB
    }
  ])
}
