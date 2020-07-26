import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'Dashboard',
                title: 'Dashboard',
                translate: 'NAV.Dashboard',
                type: 'item',
                icon: 'apps',
                url: '/home',
                // function: () => {
                //     alert('Custom function!');
                // }

            },

            {
                id: 'Admins',
                title: 'Admins',
                translate: 'NAV.Admins',
                type: 'item',
                icon: 'visibility',
                url: '/admins',

            },
            {
                id: 'Bussiness',
                title: 'Bussiness',
                translate: 'NAV.Bussiness',
                type: 'item',
                icon: 'perm_identity',
                url: '/business',

            },
            {
                id: 'Locations',
                title: 'Locations',
                translate: 'NAV.Location',
                type: 'item',
                icon: 'edit_location',
                url: '/location',

            }
            , {
                id: 'Websites',
                title: 'Websites',
                translate: 'NAV.Websites',
                type: 'collapsable',
                icon: 'call_to_action',
                children: [
                    {
                        id: 'website_image',
                        title: 'Website Image',
                        type: 'item',
                        icon: 'add_a_photo',

                        translate: 'child.website_image',
                        url: '/upload_images',
                        exactMatch: true
                    },
                    {
                        id: 'website_Detail',
                        title: 'Website Detail',
                        type: 'item',
                        icon: 'add_location',

                        translate: 'child.website_detail',
                        url: '/website_detail',
                        exactMatch: true
                    }, {
                        id: 'website_vidoes',
                        title: 'Website Vidoes',
                        type: 'item',
                        icon: 'airplay',

                        translate: 'child.website_videos',
                        url: '/website_videos',
                        exactMatch: true
                    },
                    {
                        id: 'sponsors',
                        title: 'Sponsors',
                        type: 'item',
                        icon: 'assistant',
                        translate: 'child.sponsors',
                        url: '/sponsors',
                        exactMatch: true
                    },
                    {
                        id: 'Contacts',
                        title: 'Contacts',
                        type: 'item',
                        icon: 'account_box',
                        translate: 'child.contacts',
                        url: '/contacts',
                        exactMatch: true
                    },

                ]
            }

        ]
    }
];
